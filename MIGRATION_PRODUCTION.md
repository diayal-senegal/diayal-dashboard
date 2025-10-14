# Migration PayDunya vers Production

## 🚀 Étapes pour passer en production

### 1. Obtenir les clés de production PayDunya
- Connectez-vous à votre dashboard PayDunya
- Passez du mode "Test" au mode "Live"
- Récupérez vos nouvelles clés de production

### 2. Mise à jour des variables d'environnement

**Backend (.env) :**
```env
# Remplacez par vos clés de production
PAYDUNYA_MASTER_KEY=votre_master_key_production
PAYDUNYA_PRIVATE_KEY=votre_private_key_production
PAYDUNYA_PUBLIC_KEY=votre_public_key_production
PAYDUNYA_TOKEN=votre_token_production
PAYDUNYA_MODE=live

# URLs de production
CLIENT_URL=https://votre-domaine.com
SERVER_URL=https://api.votre-domaine.com
STORE_NAME=Votre E-commerce
```

### 3. Mise à jour des URLs de callback PayDunya
Dans votre dashboard PayDunya, configurez :
- **Return URL**: `https://votre-domaine.com/payment/success`
- **Cancel URL**: `https://votre-domaine.com/payment/cancel`
- **Webhook URL**: `https://api.votre-domaine.com/api/payment/webhook`

### 4. Mise à jour du frontend
**Dans `PayDunya.jsx` :**
```javascript
// Remplacez localhost par votre domaine de production
const endpoint = paymentType === 'mobile' 
    ? 'https://api.votre-domaine.com/api/payment/mobile/initiate'
    : 'https://api.votre-domaine.com/api/payment/card/initiate';
```

### 5. Tests de production
- Testez avec de vrais numéros de téléphone
- Testez avec de vraies cartes bancaires
- Vérifiez les webhooks
- Testez les redirections

## ⚡ Migration rapide (1 minute)

**Fichiers à modifier :**
1. `backend/.env` - Clés de production
2. `frontend/src/components/PayDunya.jsx` - URLs de production
3. Dashboard PayDunya - URLs de callback

**Commandes :**
```bash
# Backend
cd backend
# Modifier .env avec clés production
npm run server

# Frontend  
cd frontend
# Modifier PayDunya.jsx avec URLs production
npm run build
```

## 🔒 Sécurité production

### Variables d'environnement sécurisées
- Utilisez des services comme Heroku Config Vars
- Ou AWS Systems Manager Parameter Store
- Jamais de clés en dur dans le code

### HTTPS obligatoire
- PayDunya exige HTTPS en production
- Configurez SSL/TLS sur votre serveur

### Validation des webhooks
```javascript
// Ajoutez dans paydunyaController.js
const crypto = require('crypto');

const validateWebhook = (req, res, next) => {
    const signature = req.headers['x-paydunya-signature'];
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
        .createHmac('sha256', process.env.PAYDUNYA_PRIVATE_KEY)
        .update(payload)
        .digest('hex');
    
    if (signature === expectedSignature) {
        next();
    } else {
        res.status(401).json({ error: 'Invalid signature' });
    }
};
```

## 📊 Monitoring production

### Logs à surveiller
- Succès/échecs de paiement
- Temps de réponse PayDunya
- Erreurs de webhook

### Métriques importantes
- Taux de conversion
- Montant des transactions
- Méthodes de paiement populaires

La migration est **très simple** - juste changer les clés et URLs ! 🎉