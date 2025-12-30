import axios from "axios";

 const api = axios.create({
     baseURL: process.env.NODE_ENV === 'production' 
         ? `${process.env.REACT_APP_API_URL}/api` 
         : "http://localhost:5000/api",
     withCredentials: true // Envoyer les cookies httpOnly automatiquement
    });

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 409 || error.response?.status === 401) {
            // Token expiré ou invalide - rediriger vers login
            const currentPath = window.location.pathname;
            if (!currentPath.includes('/login')) {
                window.location.href = currentPath.includes('/admin') ? '/admin/login' : '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api