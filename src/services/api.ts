import axios, { AxiosResponse } from 'axios';
import { Product, Variant, ApiResponse } from '../types';

// Use VITE_API_URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL); // Debugging

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running or not accessible');
    }
    
    if (error.response?.status === 404) {
      console.error('API endpoint not found');
    }
    
    return Promise.reject(error);
  }
);

// Products API
export const productAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Product[]>>> => api.get('/products'),
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Product>>> => api.get(`/products/${id}`),
  getByCategory: (category: string): Promise<AxiosResponse<ApiResponse<Product[]>>> => api.get(`/products/category/${category}`),
  create: (formData: FormData): Promise<AxiosResponse<ApiResponse<{ id: number }>>> =>
    api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, formData: FormData): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> => api.delete(`/products/${id}`),
};

// Variants API
export const variantAPI = {
  getByProductId: (productId: number): Promise<AxiosResponse<ApiResponse<Variant[]>>> => 
    api.get(`/variants/product/${productId}`),
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Variant>>> => api.get(`/variants/${id}`),
  create: (formData: FormData): Promise<AxiosResponse<ApiResponse<{ id: number }>>> =>
    api.post('/variants', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, formData: FormData): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.put(`/variants/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> => api.delete(`/variants/${id}`),
};

export default api;
