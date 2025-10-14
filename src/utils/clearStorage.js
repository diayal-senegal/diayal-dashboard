// Utilitaire pour nettoyer le localStorage en cas de problème
export const clearBannerStorage = () => {
    try {
        localStorage.removeItem('pendingBanners');
        localStorage.removeItem('publishedBanners');
        localStorage.removeItem('frontendBanners');
        console.log('Storage nettoyé avec succès');
    } catch (error) {
        console.error('Erreur lors du nettoyage:', error);
    }
};

// Fonction pour vérifier la taille du localStorage
export const checkStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length;
        }
    }
    console.log(`Taille localStorage: ${(total / 1024).toFixed(2)} KB`);
    return total;
};