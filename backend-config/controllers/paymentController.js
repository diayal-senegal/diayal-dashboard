const PaydunyaService = require('../services/PaydunyaService');

// Initier paiement mobile
const initiateMobilePayment = async (req, res) => {
    try {
        const { orderId, amount, provider, phoneNumber, customerName } = req.body;

        const paymentResult = await PaydunyaService.initiateMobilePayment({
            orderId,
            amount,
            provider,
            phoneNumber,
            customerName
        });

        if (paymentResult.response_code === '00') {
            res.status(200).json({
                success: true,
                message: 'Paiement initié avec succès',
                payment_url: paymentResult.response_text,
                token: paymentResult.token
            });
        } else {
            res.status(400).json({
                success: false,
                message: paymentResult.response_text || 'Erreur lors de l\'initiation du paiement'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors du paiement mobile'
        });
    }
};

// Initier paiement par carte
const initiateCardPayment = async (req, res) => {
    try {
        const { orderId, amount, customerName, cardNumber, expiryDate, cvv } = req.body;

        const paymentResult = await PaydunyaService.initiateCardPayment({
            orderId,
            amount,
            customerName,
            cardNumber,
            expiryDate,
            cvv
        });

        if (paymentResult.response_code === '00') {
            res.status(200).json({
                success: true,
                message: 'Paiement par carte initié avec succès',
                payment_url: paymentResult.response_text,
                token: paymentResult.token
            });
        } else {
            res.status(400).json({
                success: false,
                message: paymentResult.response_text || 'Erreur lors de l\'initiation du paiement par carte'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors du paiement par carte'
        });
    }
};

// Vérifier le statut d'un paiement
const verifyPayment = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const verificationResult = await PaydunyaService.verifyPayment(transactionId);

        if (verificationResult.response_code === '00') {
            res.status(200).json({
                success: true,
                message: 'Paiement vérifié avec succès',
                status: 'completed'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Paiement non confirmé',
                status: 'failed'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification du paiement'
        });
    }
};

// Webhook PayDunya
const paydunyaWebhook = async (req, res) => {
    try {
        const { data } = req.body;
        console.log('Webhook PayDunya reçu:', data);
        res.status(200).json({ message: 'Webhook reçu' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur webhook' });
    }
};

module.exports = {
    initiateMobilePayment,
    initiateCardPayment,
    verifyPayment,
    paydunyaWebhook
};