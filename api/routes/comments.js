/* globals require */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Comment = require('../models/comment');
const Watch = require('../models/watch');

/*router.get('/asa/comments', (req, res, next) => {
    Comment.find()
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
});*/

router.post('/:watchId/comments',
    checkAuth,
    (req, res, next) => {
        const watchId = req.params.watchId;

        Watch.findOne({_id: watchId})
            .exec()
            .then(doc => {
                const comment = new Comment({
                    _id: new mongoose.Types.ObjectId(),
                    content: req.body.content,
                    watch: new mongoose.Types.ObjectId(watchId),
                    author: req.userData.userId
                });

                comment.save()
                    .then(() => {
                        const comments = doc.comments;
                        comments.push(comment);
                        doc.comments = comments;
                        doc.save()
                            .then(() => res.status(201).json(comment).end())
                            .catch(error => res.status(500).json({error}).end());
                    })
                    .catch(error => res.status(500).json({error}).end());
            })
            .catch(error => res.status(500).json({error}).end());
    }
);

router.delete('/comments/:commentId',
    checkAuth,
    (req, res, next) => {
        const commentId = req.params.commentId;
        Comment.findOne({_id: commentId})
            .then(comment => {
                if (comment.author.toString() !== req.userData.userId) {
                    return res.status(403).json({message: 'Access denied!'}).end();
                }
                Comment.remove({_id: commentId})
                    .then(() => {
                        Watch.findOne({_id: comment.watch})
                            .then(watch => {
                                const newComments = watch.comments.filter(com => com._id !== commentId);
                                watch.comments = newComments;
                                watch.save()
                                    .then(() => res.status(200).json({message: 'comment was successfully deleted'}).end())
                                    .catch(error => res.status(500).json({error}).end());
                            })
                            .catch(error => res.status(500).json({error}).end());
                    })
                    .catch(error => res.status(500).json({error}).end());
            })
            .catch(error => res.status(500).json({error}).end());
    }
);

module.exports = router;