const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    price: {type: String, required: true},
    watch: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Watch'},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
});

module.exports = mongoose.model('Order', orderSchema);