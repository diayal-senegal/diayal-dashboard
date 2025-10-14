# Intégration PayDunya - Guide Complet

## 🚀 Configuration Backend

### 1. Copier les fichiers backend
Copiez le contenu du dossier `backend-config/` dans votre projet backend :
- `controllers/paymentController.js`
- `services/PaydunyaService.js` 
- `routes/paymentRoutes.js`

### 2. Variables d'environnement
Ajoutez dans votre fichier `.env` :
```env
PAYDUNYA_MASTER_KEY=**************************
PAYDUNYA_PRIVATE_KEY=**************************
PAYDUNYA_PUBLIC_KEY=**************************
PAYDUNYA_TOKEN=**************************
PAYDUNYA_MODE=test
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000
STORE_NAME=Votre E-commerce
```

### 3. Intégration dans server.js
```javascript
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);
```

### 4. Dépendances NPM
```bash
npm install axios
```

## 🎨 Intégration Frontend

### Composants disponibles :
- `src/views/components/MobilePayment.jsx` - Modal de paiement
- `src/views/components/Checkout.jsx` - Interface de checkout
- `src/views/components/PaymentStatus.jsx` - Statut de paiement

### Intégration dans votre page de paiement existante :

```javascript
import MobilePayment from './components/MobilePayment';
import Checkout from './components/Checkout';

// Dans votre composant de paiement
const [showPaymentModal, setShowPaymentModal] = useState(false);

// Données de commande
const orderData = {
    orderId: 'CMD123',
    total: 5000
};

// Affichage
<Checkout 
    orderData={orderData}
    onClose={() => setShowPaymentModal(false)}
/>
```

## 📱 Endpoints API

### POST `/api/payment/mobile/initiate`
```json
{
    "orderId": "CMD123",
    "amount": 5000,
    "provider": "orange-money-senegal",
    "phoneNumber": "77123456",
    "customerName": "John Doe"
}
```

### POST `/api/payment/card/initiate`
```json
{
    "orderId": "CMD123", 
    "amount": 5000,
    "customerName": "John Doe",
    "cardNumber": "1234567890123456",
    "expiryDate": "12/25",
    "cvv": "123"
}
```

### GET `/api/payment/verify/:transactionId`
Vérification du statut de paiement

### POST `/api/payment/webhook`
Webhook PayDunya pour les notifications

## 🔧 Configuration PayDunya

1. Créez un compte sur https://paydunya.com
2. Récupérez vos clés API dans le dashboard
3. Configurez les URLs de callback :
   - Return URL: `${CLIENT_URL}/payment/success`
   - Cancel URL: `${CLIENT_URL}/payment/cancel`
   - Webhook URL: `${SERVER_URL}/api/payment/webhook`

## ✅ Test

Une fois configuré, testez avec :
- Orange Money Sénégal
- Free Money
- E-Money
- Cartes Visa/MasterCard

Les composants sont prêts à être intégrés dans votre page de paiement existante !