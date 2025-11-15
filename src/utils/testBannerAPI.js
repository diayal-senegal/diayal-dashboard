// Script de test pour l'API des bannières
import api from '../api/api';

export const testBannerAPI = async () => {
    console.log('=== TEST API BANNIERES ===');
    
    try {
        // Test 1: Récupérer toutes les bannières
        console.log('1. Test GET /banners');
        const allBanners = await api.get('/banners');
        console.log('Réponse:', allBanners.data);
        
        // Test 2: Récupérer les bannières en attente
        console.log('2. Test GET /banners/pending');
        try {
            const pendingBanners = await api.get('/banners/pending');
            console.log('Bannières en attente:', pendingBanners.data);
        } catch (error) {
            console.log('Erreur /banners/pending:', error.response?.status, error.response?.data);
        }
        
        // Test 3: Vérifier l'authentification
        console.log('3. Test authentification');
        const token = localStorage.getItem('accessToken');
        console.log('Token présent:', !!token);
        
        return allBanners.data;
        
    } catch (error) {
        console.error('Erreur API:', error.response?.status, error.response?.data || error.message);
        return null;
    }
};

// Fonction pour créer une bannière de test
export const createTestBanner = async () => {
    try {
        const formData = new FormData();
        
        // Créer une image de test (1x1 pixel)
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 1, 1);
        
        canvas.toBlob(async (blob) => {
            formData.append('image', blob, 'test.jpg');
            formData.append('sellerId', 'test-seller-id');
            formData.append('bannerType', 'gratuit');
            formData.append('price', '0');
            formData.append('status', 'pending_validation');
            
            const response = await api.post('/banners', formData);
            console.log('Bannière de test créée:', response.data);
        });
        
    } catch (error) {
        console.error('Erreur création bannière test:', error);
    }
};