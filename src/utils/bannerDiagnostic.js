// Script de diagnostic pour les bannières
export const diagnoseBanners = () => {
    console.log('🔍 DIAGNOSTIC DES BANNIÈRES');
    console.log('============================');
    
    // Vérifier localStorage
    const pendingBanners = JSON.parse(localStorage.getItem('pendingBanners') || '[]');
    const publishedBanners = JSON.parse(localStorage.getItem('publishedBanners') || '[]');
    const frontendBanners = JSON.parse(localStorage.getItem('frontendBanners') || '[]');
    
    console.log('📊 ÉTAT ACTUEL:');
    console.log(`- pendingBanners: ${pendingBanners.length} éléments`);
    console.log(`- publishedBanners: ${publishedBanners.length} éléments`);
    console.log(`- frontendBanners: ${frontendBanners.length} éléments`);
    
    if (pendingBanners.length > 0) {
        console.log('📋 BANNIÈRES EN ATTENTE:');
        pendingBanners.forEach((banner, i) => {
            console.log(`  ${i+1}. ${banner.sellerName} - ${banner.bannerType} - ${banner.status}`);
        });
    }
    
    if (publishedBanners.length > 0) {
        console.log('✅ BANNIÈRES PUBLIÉES:');
        publishedBanners.forEach((banner, i) => {
            console.log(`  ${i+1}. ${banner.sellerName} - ${banner.bannerType}`);
        });
    }
    
    if (frontendBanners.length > 0) {
        console.log('🌐 BANNIÈRES FRONTEND:');
        frontendBanners.forEach((banner, i) => {
            console.log(`  ${i+1}. ${banner.sellerName} - ${banner.bannerType}`);
        });
    }
    
    // Recommandations
    console.log('💡 RECOMMANDATIONS:');
    if (frontendBanners.length > 0 && publishedBanners.length === 0) {
        console.log('⚠️  Les bannières sont visibles sur le site mais pas dans le dashboard admin');
        console.log('🔧 Solution: Cliquer sur "Synchroniser" dans le dashboard');
    }
    
    if (publishedBanners.length > 0 && frontendBanners.length === 0) {
        console.log('⚠️  Les bannières sont dans le dashboard mais pas sur le site');
        console.log('🔧 Solution: Cliquer sur "Synchroniser" dans le dashboard');
    }
    
    return {
        pending: pendingBanners.length,
        published: publishedBanners.length,
        frontend: frontendBanners.length
    };
};