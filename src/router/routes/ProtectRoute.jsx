import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectRoute = ({route,children}) => {
    const {role, userInfo, authChecked} = useSelector(state => state.auth)

    // Attendre la vérification de l'authentification
    if (!authChecked) {
        return null // ou un loader si vous voulez
    }

    if (role) {
        if (route.role) {
            if (userInfo) {
                if (userInfo.role === route.role) {
                    if (route.status) {
                        if (route.status === userInfo.status) {
                            return <Suspense fallback={null} >{children}</Suspense>
                        }else {
                            if (userInfo.status === 'pending') {
                                return <Navigate to='/seller/account-pending' replace />
                            } else {
                                return <Navigate to='/seller/account-deactive' replace />
                            } 
                    }
                
                }  else {
                    if (route.visibility) {
                        if (route.visibility.some(r => r === userInfo.status)) {
                            return <Suspense fallback={null} >{children}</Suspense>
                        } else {
                            return <Navigate to='/seller/account-pending' replace />
                        }
                        
                    } else {
                        return <Suspense fallback={null} >{children}</Suspense>
                    }
                   
                }
                
               }else{
                return <Navigate to='/unauthorized' replace />
               }
            } 


            
        } else {
            if (route.ability === 'seller') {
                return <Suspense fallback={null} >{children}</Suspense>
            } 
        } 
    }else {
        return <Navigate to='/login' replace />
    }
 

    
};

export default ProtectRoute;