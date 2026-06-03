import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: '/api/admin',
  timeout: 10000
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    message.error(error.response?.data?.message || '请求失败');
    return Promise.reject(error);
  }
);

export default request;
