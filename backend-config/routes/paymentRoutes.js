const express = require('express');
const router = express.Router();
const { 
    initiateMobilePayment, 
    initiateCardPayment, 
    verifyPayment, 
    paydunyaWebhook 
} = require('../controllers/paymentController');

// Routes de paiement
router.post('/mobile/initiate', initiateMobilePayment);
router.post('/card/initiate', initiateCardPayment);
router.get('/verify/:transactionId', verifyPayment);
router.post('/webhook', paydunyaWebhook);

module.exports = router;