'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');

router.get('/:userId',
    checkAuth,
    (req, res, next) => {
    const userId = req.params.userId;

    Order.find({user: userId})
        .populate('watch')
        .exec()
        .then(docs => {
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

router.post('/',
    checkAuth,
    (req, res, next) => {
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            price: req.body.price,
            watch: req.body.watch,
            user: req.body.user
        });

        order.save()
            .then(result => {
                res.status(201).json({
                    message: 'Order created!'
                }).end();
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message
                }).end();
            })
    });

router.delete('/:orderId',
    checkAuth,
    (req, res, next) => {
        const orderId = req.params.orderId;

        Order.remove({_id: orderId})
            .exec()
            .then(() => {
                res.status(200).json({
                    message: 'success'
                });
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

module.exports = router;
