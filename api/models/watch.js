const mongoose = require('mongoose');

const watchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    color: {type: String, required: true},
    gender: {type: String, required: true},
    waterResistance: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null}]
});

module.exports = mongoose.model('Watch', watchSchema);