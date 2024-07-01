const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    transactionId: String,
    email: String,
    price: Number,
    status: String,
    itemName: [String],   // Assuming itemName is an array of strings
    cartItems: [Schema.Types.Mixed],   // Example: Array of mixed types
    menuItems: [Schema.Types.ObjectId], // Example: Array of ObjectIds
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
