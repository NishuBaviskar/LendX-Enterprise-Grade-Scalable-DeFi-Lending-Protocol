import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Must match server.js port and prefix
    headers: {
        'Content-Type': 'application/json'
    }
});

// Automatically add Firebase Token to headers if it exists
api.interceptors.request.use(async(config) => {
    const token = localStorage.getItem('fb-token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;