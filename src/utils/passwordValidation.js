export const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }
    
    const commonPasswords = ['password', '123456', 'azerty', 'qwerty', 'admin'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
        errors.push('Le mot de passe est trop commun');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

export const getPasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'Faible', color: 'red', percentage: 33 };
    if (strength <= 3) return { level: 'Moyen', color: 'orange', percentage: 66 };
    return { level: 'Fort', color: 'green', percentage: 100 };
};
