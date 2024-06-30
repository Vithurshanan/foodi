const mongoose = require('mongoose');
const { emit } = require('./Menu');
const { Schema } = mongoose;


const paymentSchema = new Schema({
    transitionId: String,
    email: String,
    price: Number,
    status: String,
    itemName: Array,
    cartItems: Array,
    menuItems: Array,
    createAt: {
        type: Date,
        default: Date.now
    }
})

const payment = mongoose.model('payment', paymentSchema);

module.exports = payment;