// frontend/src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // URL ของ Backend API

const api = axios.create({
    baseURL: API_URL,
});

// เพิ่ม Interceptor เพื่อใส่ Token ใน Header ทุกครั้งที่มีการเรียก API ที่ต้องยืนยันตัวตน
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;