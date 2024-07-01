const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Correct import with capital "P"
const Cart = require('../models/Carts');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const verifyToken = require('../middleware/verifyToken');

// POST payment information
router.post('/', verifyToken, async (req, res) => {
    const payments = req.body;

    if (!payments || !payments.cartItems || !Array.isArray(payments.cartItems)) {
        return res.status(400).json({ message: 'Invalid payment data. cartItems is required and should be an array.' });
    }

    try {
        const paymentRequest = await Payment.create(payments); // Corrected usage of Payment model

        // Delete cart after payment
        const cartIds = payments.cartItems.map(id => new ObjectId(id));
        const deleteCartRequest = await Cart.deleteMany({ _id: { $in: cartIds } });

        res.status(200).json({ paymentRequest, deleteCartRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', verifyToken, async (req, res) => {
    const email = req.query.email;
    const query = { email: email };
    
    //console.log('Received email:', email);

    try {
        const decodedEmail = req.decoded.email;
        //console.log('Decoded email:', decodedEmail);
        
        if (email !== decodedEmail) {
            res.status(403).json({ message: "Forbidden Access" });
            return; // Stop further execution
        }

        const result = await Payment.find(query).sort({ createdAt: -1 }).exec(); // Corrected usage of Payment model
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
