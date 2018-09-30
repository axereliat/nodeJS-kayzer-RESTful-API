/* globals require */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const fs = require('fs');
const checkAuth = require('../middleware/check-auth');
//const cloudUpload = require('../lib/cloudinary');
const cloudUpload = require('../lib/cloudinary-upload');

const Watch = require('../models/watch');

router.get('/', (req, res, next) => {
    console.log('GOT IT!!!!');
    Watch.find()
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


router.post('/',
    checkAuth,
    cloudUpload('image', ['image/jpeg', 'image/jpg', 'image/png']),
    (req, res, next) => {
        const watch = new Watch({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            image: req['imageUrl'] || null,
            description: req.body.description,
            price: req.body.price,
            color: req.body.color,
            gender: req.body.gender,
            waterResistance: req.body.waterResistance,
            author: req.userData.userId
        });

        watch.save()
            .then(result => {
                res.status(200).json(watch);
                res.end();
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
                res.end();
            });
    },
);

router.get('/:watchId', (req, res, next) => {
    const watchId = req.params.watchId;
    Watch.findById(watchId)
        .populate('author comments')
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
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

router.patch('/:watchId',
    checkAuth,
    cloudUpload('image', ['image/jpeg', 'image/jpg', 'image/png']),
    (req, res, next) => {
        const watchId = req.params.watchId;
        const data = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            color: req.body.color,
            gender: req.body.gender,
            waterResistance: req.body.waterResistance
        };

        if (typeof req['imageUrl'] !== "undefined") {
            data['image'] = req['imageUrl'];
        }

        Watch.update({_id: watchId}, {
                $set: data
            })
            .exec()
            .then(doc => {
                console.log(doc);
                res.status(200).json(doc);
                res.end();
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
                res.end();
            })
    },
);

router.delete('/:watchId', checkAuth, (req, res, next) => {
    const watchId = req.params.watchId;

    Watch.remove({_id: watchId})
        .exec()
        .then(doc => {
            console.log(doc);
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