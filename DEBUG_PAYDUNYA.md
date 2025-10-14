# Debug PayDunya - Résolution d'erreurs

## 🔍 Étapes de diagnostic

### 1. Vérifier les logs backend
Ouvrez la console de votre serveur backend et regardez les erreurs lors du clic sur "Payer"

### 2. Vérifier la console navigateur
- F12 → Console
- Network → Regardez la requête vers `/api/payment/mobile/initiate`
- Vérifiez le statut de la réponse (200, 400, 500?)

### 3. Test direct de l'API
```bash
curl -X POST http://localhost:5000/api/payment/mobile/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST123",
    "amount": 1000,
    "provider": "orange-money-senegal",
    "phoneNumber": "77000000",
    "customerName": "Test User"
  }'
```

## 🛠️ Solutions communes

### Erreur 1: "Cannot POST /api/payment/mobile/initiate"
**Cause**: Routes non configurées
**Solution**: Vérifiez que le serveur backend inclut les routes PayDunya

### Erreur 2: "Network Error" ou CORS
**Cause**: Problème CORS
**Solution**: Ajoutez dans server.js:
```javascript
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
```

### Erreur 3: "Erreur PayDunya Mobile: Request failed"
**Cause**: Clés API incorrectes
**Solution**: Vérifiez les clés dans .env

### Erreur 4: "Invalid phone number format"
**Cause**: Format numéro incorrect
**Solution**: Utilisez le format complet: +221770000000

## 🔧 Corrections rapides