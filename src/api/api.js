import axios from "axios";

 const api = axios.create({
     baseURL: process.env.NODE_ENV === 'production' 
         ? "https://diayal-backend.onrender.com/api" 
         : "http://localhost:5000/api"
    });

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api