import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true, // Required for cookies/sessions if used
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
