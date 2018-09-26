const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    watch: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Watch'}
});

module.exports = mongoose.model('Comment', commentSchema);