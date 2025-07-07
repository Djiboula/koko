const express = require('express');
const User = require('../models/User');
const Router = express.Router();

// Route pour ajouter un utilisateur
router.post('/', async (req, res) => {
    const { username, email, password, role, photoIdentite } = req.body;
    const newUser = new User({ username, email, password, role, photoIdentite });

    try {
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route pour récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // à installer
const User = require('../models/User'); // modèle utilisateur

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Mot de passe incorrect" });

        res.json({ message: "Connexion réussie", user: { email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

module.exports = router;

