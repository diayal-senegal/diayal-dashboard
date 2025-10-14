// Utilitaire pour synchroniser les bannières entre les différents localStorage
export const syncBanners = () => {
    try {
        // Récupérer toutes les sources de bannières
        const pendingBanners = JSON.parse(localStorage.getItem('pendingBanners') || '[]');
        const publishedBanners = JSON.parse(localStorage.getItem('publishedBanners') || '[]');
        const frontendBanners = JSON.parse(localStorage.getItem('frontendBanners') || '[]');
        
        console.log('Synchronisation des bannières:');
        console.log('- Pending:', pendingBanners.length);
        console.log('- Published:', publishedBanners.length);
        console.log('- Frontend:', frontendBanners.length);
        
        // Si frontendBanners existe mais publishedBanners est vide, synchroniser
        if (frontendBanners.length > 0 && publishedBanners.length === 0) {
            localStorage.setItem('publishedBanners', JSON.stringify(frontendBanners));
            console.log('✅ Synchronisation: frontendBanners → publishedBanners');
        }
        
        // Si publishedBanners existe mais frontendBanners est vide, synchroniser
        if (publishedBanners.length > 0 && frontendBanners.length === 0) {
            localStorage.setItem('frontendBanners', JSON.stringify(publishedBanners));
            console.log('✅ Synchronisation: publishedBanners → frontendBanners');
        }
        
        return {
            pending: pendingBanners.length,
            published: publishedBanners.length,
            frontend: frontendBanners.length
        };
    } catch (error) {
        console.error('Erreur lors de la synchronisation:', error);
        return { pending: 0, published: 0, frontend: 0 };
    }
};

export const clearAllBanners = () => {
    localStorage.removeItem('pendingBanners');
    localStorage.removeItem('publishedBanners');
    localStorage.removeItem('frontendBanners');
    console.log('🗑️ Toutes les bannières supprimées');
};