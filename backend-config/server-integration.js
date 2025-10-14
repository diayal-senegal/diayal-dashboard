// Intégration dans votre serveur Express existant

const express = require('express');
const paymentRoutes = require('./routes/paymentRoutes');

// Dans votre fichier server.js principal, ajoutez :

// Middleware pour les paiements
app.use('/api/payment', paymentRoutes);

// Exemple d'intégration complète :
/*
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes existantes
// ... vos autres routes

// Routes PayDunya
app.use('/api/payment', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
*/

module.exports = { paymentRoutes };