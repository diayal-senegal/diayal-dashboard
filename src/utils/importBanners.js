// Importer les bannières depuis le fichier banners.json
export const importBannersFromFrontend = async () => {
    try {
        console.log('🔄 Importation des bannières...');
        
        // Récupérer depuis banners.json
        const response = await fetch('http://localhost:3000/banners.json?t=' + Date.now());
        if (response.ok) {
            const banners = await response.json();
            if (banners && banners.length > 0) {
                localStorage.setItem('publishedBanners', JSON.stringify(banners));
                localStorage.setItem('frontendBanners', JSON.stringify(banners));
                console.log(`✅ Importé ${banners.length} bannières depuis banners.json`);
                return banners.length;
            }
        }
        
        console.log('❌ Aucune bannière trouvée');
        return 0;
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'importation:', error);
        return 0;
    }
};