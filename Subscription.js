const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['en attente', 'abonné'], default: 'en attente' },
    dateConfirmation: Date
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
