import React from 'react';
import { getPasswordStrength } from '../utils/passwordValidation';

const PasswordStrengthIndicator = ({ password }) => {
    if (!password) return null;
    
    const { level, color, percentage } = getPasswordStrength(password);
    
    const colorClasses = {
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        green: 'bg-green-500'
    };
    
    return (
        <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-300">Force du mot de passe</span>
                <span className={`text-xs font-medium text-${color}-400`}>{level}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                    className={`${colorClasses[color]} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;
