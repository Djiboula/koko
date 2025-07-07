const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch((error) => console.log('Erreur de connexion à MongoDB :', error));

app.use(express.static('public'));


// Routes
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

// Récupérer l’abonnement d’un utilisateur
app.get('/api/subscriptions/user/:userId', (req, res) => {
    Subscription.findOne({ userId: req.params.userId }, (err, subscription) => {
        if (err) return res.status(500).send(err);
        if (!subscription) return res.status(404).send({ message: "Aucun abonnement trouvé." });
        res.json(subscription);
    });
});

// Publier un numéro (Forcasseur)
app.post('/api/publications', (req, res) => {
    const { userId, nomNumero, numero, commentaire } = req.body;
    // Tu peux aussi récupérer le nom du forcasseur via l’ID
    const publication = new Publication({
        userId,
        nomNumero,
        numero,
        commentaire,
        date: new Date()
    });
    publication.save((err, saved) => {
        if (err) return res.status(500).send(err);
        res.json(saved);
    });
});

// Voir les publications (Parieur)
app.get('/api/publications', (req, res) => {
    Publication.find()
        .populate("userId", "username") // pour afficher le nom du forcasseur
        .sort({ date: -1 })
        .exec((err, pubs) => {
            if (err) return res.status(500).send(err);
            const results = pubs.map(p => ({
                nomNumero: p.nomNumero,
                numero: p.numero,
                commentaire: p.commentaire,
                date: p.date,
                nomForcasseur: p.userId.username
            }));
            res.json(results);
        });
});
