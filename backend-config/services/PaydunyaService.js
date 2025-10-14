const axios = require('axios');

class PaydunyaService {
    constructor() {
        this.baseURL = 'https://app.paydunya.com/api/v1';
        // Variables d'environnement à configurer
        this.masterKey = process.env.PAYDUNYA_MASTER_KEY || '**************************';
        this.privateKey = process.env.PAYDUNYA_PRIVATE_KEY || '**************************';
        this.publicKey = process.env.PAYDUNYA_PUBLIC_KEY || '**************************';
        this.token = process.env.PAYDUNYA_TOKEN || '**************************';
        this.mode = process.env.PAYDUNYA_MODE || 'test';
    }

    async initiateMobilePayment(paymentData) {
        const { orderId, amount, provider, phoneNumber, customerName } = paymentData;
        
        const payload = {
            invoice: {
                total_amount: amount,
                description: `Commande #${orderId}`,
                return_url: `${process.env.CLIENT_URL}/payment/success`,
                cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
                callback_url: `${process.env.SERVER_URL}/api/payment/webhook`
            },
            store: {
                name: process.env.STORE_NAME || "Votre E-commerce",
                tagline: "Boutique en ligne"
            },
            custom_data: {
                order_id: orderId,
                payment_type: 'mobile'
            },
            actions: {
                payment_method: provider,
                customer_phone_number: phoneNumber,
                customer_name: customerName
            }
        };

        try {
            const response = await axios.post(`${this.baseURL}/checkout-invoice/create`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'PAYDUNYA-MASTER-KEY': this.masterKey,
                    'PAYDUNYA-PRIVATE-KEY': this.privateKey,
                    'PAYDUNYA-TOKEN': this.token
                }
            });

            return response.data;
        } catch (error) {
            throw new Error(`Erreur PayDunya Mobile: ${error.message}`);
        }
    }

    async initiateCardPayment(paymentData) {
        const { orderId, amount, customerName, cardNumber, expiryDate, cvv } = paymentData;
        
        const payload = {
            invoice: {
                total_amount: amount,
                description: `Commande #${orderId}`,
                return_url: `${process.env.CLIENT_URL}/payment/success`,
                cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
                callback_url: `${process.env.SERVER_URL}/api/payment/webhook`
            },
            store: {
                name: process.env.STORE_NAME || "Votre E-commerce",
                tagline: "Boutique en ligne"
            },
            custom_data: {
                order_id: orderId,
                payment_type: 'card'
            },
            actions: {
                payment_method: 'card',
                customer_name: customerName,
                card_number: cardNumber,
                card_expiry: expiryDate,
                card_cvv: cvv
            }
        };

        try {
            const response = await axios.post(`${this.baseURL}/checkout-invoice/create`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'PAYDUNYA-MASTER-KEY': this.masterKey,
                    'PAYDUNYA-PRIVATE-KEY': this.privateKey,
                    'PAYDUNYA-TOKEN': this.token
                }
            });

            return response.data;
        } catch (error) {
            throw new Error(`Erreur PayDunya Carte: ${error.message}`);
        }
    }

    async verifyPayment(transactionId) {
        try {
            const response = await axios.get(`${this.baseURL}/checkout-invoice/confirm/${transactionId}`, {
                headers: {
                    'PAYDUNYA-MASTER-KEY': this.masterKey,
                    'PAYDUNYA-PRIVATE-KEY': this.privateKey,
                    'PAYDUNYA-TOKEN': this.token
                }
            });

            return response.data;
        } catch (error) {
            throw new Error(`Erreur vérification PayDunya: ${error.message}`);
        }
    }
}

module.exports = new PaydunyaService();