const express = require('express');
const payment = require('../models/Payment');
const router = express.Router();
const Cart = require('../models/Carts');
const ObjectId = mongoose.Types.ObjectId;

const verifyToken = require('../middleware/verifyToken');
const { default: mongoose } = require('mongoose');
//post payment inform to do
router.post('/', verifyToken, async (req, res) => {
    const payments = req.body;
    try {
        const paymentRequest = await payment.create(payments);

        //delete cart after payment
        const cartIds = payment.cartItems.map(id => new ObjectId(id));
        const deleteCartRequest = await Cart.deleteMany({ _id: {$in: cartIds} })


        res.status(200).json({ paymentRequest, deleteCartRequest })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

module.exports = router;