const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['parieur', 'forcasseur'], required: true },
    photoIdentite: String, // Photo pour les forcasseurs
    abonnement: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);

