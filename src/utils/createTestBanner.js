import api from '../api/api';

export const createTestBanner = async () => {
    try {
        console.log('Création d\'une bannière de test...');
        
        // Créer une image de test simple
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        // Dessiner un rectangle coloré
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(0, 0, 400, 200);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BANNIÈRE TEST', 200, 100);
        ctx.fillText('En attente de validation', 200, 130);
        
        // Convertir en blob
        return new Promise((resolve) => {
            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('image', blob, 'test-banner.jpg');
                formData.append('sellerId', '507f1f77bcf86cd799439011'); // ID de test
                formData.append('bannerType', 'gratuit');
                formData.append('price', '0');
                formData.append('status', 'pending_validation');
                
                try {
                    const response = await api.post('/banners', formData);
                    console.log('✅ Bannière de test créée:', response.data);
                    resolve(response.data);
                } catch (error) {
                    console.error('❌ Erreur création bannière:', error.response?.data || error.message);
                    resolve(null);
                }
            }, 'image/jpeg', 0.8);
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
};