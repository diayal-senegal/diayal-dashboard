// Synchronisation cross-origin entre dashboard et frontend
export const syncToFrontend = async (banners) => {
    try {
        // Méthode 1: Écrire dans le fichier banners.json du frontend
        const response = await fetch('http://localhost:3000/api/sync-banners', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ banners })
        });
        
        if (response.ok) {
            console.log('✅ Bannières synchronisées avec le frontend');
            return true;
        }
    } catch (error) {
        console.log('❌ API sync non disponible');
    }
    
    // Méthode 2: Utiliser postMessage si les deux apps sont ouvertes
    try {
        const frontendWindow = window.open('http://localhost:3000', 'frontend');
        if (frontendWindow) {
            frontendWindow.postMessage({
                type: 'SYNC_BANNERS',
                banners: banners
            }, 'http://localhost:3000');
            console.log('✅ Message envoyé au frontend');
            return true;
        }
    } catch (error) {
        console.log('❌ PostMessage non disponible');
    }
    
    return false;
};