import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
});

// Автоматически добавляем токен в каждый запрос, если он есть
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
