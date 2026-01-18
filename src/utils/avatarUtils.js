// Fonction pour extraire les initiales d'un nom
export const getInitials = (name) => {
    if (!name) return '?';
    
    const words = name.trim().split(/[\s-]+/);
    
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Fonction pour générer une couleur de fond basée sur le nom
export const getAvatarColor = (name) => {
    if (!name) return '#6366f1';
    
    const colors = [
        '#6366f1', // indigo
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#f59e0b', // amber
        '#10b981', // emerald
        '#3b82f6', // blue
        '#ef4444', // red
        '#06b6d4', // cyan
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
};
