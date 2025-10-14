# Guide de Test PayDunya

## 🚀 Étape 1: Démarrer les serveurs

### Backend
```bash
cd c:\Users\papou\Ecommerce\backend
npm install axios
npm run server
```

### Frontend
```bash
cd c:\Users\papou\Ecommerce\frontend
npm start
```

## 🧪 Étape 2: Test des endpoints avec Postman/Thunder Client

### Test 1: Paiement Mobile
**POST** `http://localhost:5000/api/payment/mobile/initiate`

**Body (JSON):**
```json
{
    "orderId": "TEST123",
    "amount": 1000,
    "provider": "orange-money-senegal",
    "phoneNumber": "77123456",
    "customerName": "Test User"
}
```

**Réponse attendue:**
```json
{
    "success": true,
    "message": "Paiement initié avec succès",
    "payment_url": "https://app.paydunya.com/...",
    "token": "xxx"
}
```

### Test 2: Paiement Carte
**POST** `http://localhost:5000/api/payment/card/initiate`

**Body (JSON):**
```json
{
    "orderId": "TEST124",
    "amount": 2000,
    "customerName": "Test User",
    "cardNumber": "4111111111111111",
    "expiryDate": "12/25",
    "cvv": "123"
}
```

### Test 3: Vérification
**GET** `http://localhost:5000/api/payment/verify/TRANSACTION_ID`

## 🎨 Étape 3: Test Frontend

### Créer une page de test simple
Ajoutez dans votre frontend existant:

```javascript
// TestPayment.jsx
import React, { useState } from 'react';
import Checkout from '../components/Checkout';

const TestPayment = () => {
    const [showCheckout, setShowCheckout] = useState(false);
    
    const orderData = {
        orderId: 'TEST' + Date.now(),
        total: 5000
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl mb-4">Test PayDunya</h1>
            <button 
                onClick={() => setShowCheckout(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Tester Paiement
            </button>
            
            {showCheckout && (
                <Checkout 
                    orderData={orderData}
                    onClose={() => setShowCheckout(false)}
                />
            )}
        </div>
    );
};

export default TestPayment;
```

## 📱 Étape 4: Test avec numéros de test PayDunya

### Numéros de test Orange Money:
- **Succès**: 77000000 / 70000000
- **Échec**: 77000001 / 70000001

### Cartes de test:
- **Visa**: 4111111111111111
- **MasterCard**: 5555555555554444
- **CVV**: 123
- **Date**: 12/25

## ✅ Étape 5: Vérifications

1. **Console Backend**: Vérifiez les logs
2. **Network Tab**: Vérifiez les requêtes
3. **PayDunya Dashboard**: Vérifiez les transactions
4. **URLs de callback**: Testez les redirections

## 🐛 Dépannage

### Erreur 500:
- Vérifiez les clés API dans .env
- Vérifiez que axios est installé
- Vérifiez les logs du serveur

### Erreur 404:
- Vérifiez que les routes sont bien ajoutées
- Redémarrez le serveur backend

### Pas de redirection:
- Vérifiez les URLs dans PayDunya dashboard
- Vérifiez CLIENT_URL et SERVER_URL dans .env