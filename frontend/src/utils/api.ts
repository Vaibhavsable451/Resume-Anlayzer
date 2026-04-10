import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://resume-anlayzer-33fn.onrender.com',
    withCredentials: true
});

export default api;
