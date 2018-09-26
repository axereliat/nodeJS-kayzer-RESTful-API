'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const emailExists = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({
                    error: 'Mail exists'
                }).end();
            }

            next()
        })
        .catch(err => {
            return res.status(500).json({
                error: err.message
            }).end();
        });
};

const validUsername = (req, res, next) => {
    User.find({username: req.body.username})
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({
                    error: 'Username exists'
                }).end();
            }

            next();
        })
        .catch(err => {
            return res.status(500).json({
                error: err.message
            }).end();
        });
};

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
            res.end();
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
            res.end();
        })
});

router.post('/register',
    emailExists,
    validUsername,
    (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(401).json({
            error: 'Passwords do not match'
        }).end();
    }
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            }).end();
        }

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            email: req.body.email,
            password: hash
        });

        user.save()
            .then(result => {
                res.status(201).json({
                    message: 'User created!'
                }).end();
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message
                }).end();
            })
    });
});

router.post('/login', (req, res, next) => {
    User.find({username: req.body.username})
        .exec()
        .then(users => {
            if (users.length === 0) {
                return res.status(401).json({
                    message: 'Auth failed'
                }).end();
            }
            bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    }).end();
                }
                if (result) {
                    return res.status(200).json({
                        message: 'Auth succeeded',
                        token: jwt.sign({
                            email: users[0].email,
                            username: users[0].username,
                            userId: users[0]._id
                        }, 'SECRET'),
                        username: users[0].username,
                        userId: users[0].id
                    })
                }
                return res.status(401).json({
                    message: 'Auth failed'
                }).end();
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err.message
            }).end();
        });
})

module.exports = router;
