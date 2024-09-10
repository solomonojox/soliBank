const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['deposit', 'transfer', 'request' ],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    fromAccount: {
        type: String,
        required: function () {
            return this.type === 'transfer' || this.type === 'request';
        },
    },
    toAccount: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Transaction', transactionSchema, 'transaction');