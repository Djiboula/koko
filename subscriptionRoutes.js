const express = require('express');
const Subscription = require('../models/Subscription');
const router = express.Router();

// Route pour ajouter un abonnement
router.post('/', async (req, res) => {
    const { userId, status } = req.body;
    const newSubscription = new Subscription({ userId, status });

    try {
        const subscription = await newSubscription.save();
        res.status(201).json(subscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route pour récupérer les abonnements
router.get('/', async (req, res) => {
    try {
        const subscriptions = await Subscription.find().populate('userId');
        res.json(subscriptions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
