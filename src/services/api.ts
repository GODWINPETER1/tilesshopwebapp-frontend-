import axios from 'axios';
import { Product, Variant, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Products API
export const productAPI = {
  getAll: (): Promise<ApiResponse<Product[]>> => 
    api.get('/products'),
  
  getById: (id: number): Promise<ApiResponse<Product>> => 
    api.get(`/products/${id}`),
  
  // Add this new method
  getByCategory: (category: string): Promise<ApiResponse<Product[]>> => 
    api.get(`/products/category/${category}`),
  
  create: (formData: FormData): Promise<ApiResponse<{ id: number }>> => 
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  update: (id: number, formData: FormData): Promise<ApiResponse<void>> => 
    api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  delete: (id: number): Promise<ApiResponse<void>> => 
    api.delete(`/products/${id}`)
};

// Variants API
export const variantAPI = {
  getByProductId: (productId: number): Promise<ApiResponse<Variant[]>> => 
    api.get(`/variants/product/${productId}`),
  
  getById: (id: number): Promise<ApiResponse<Variant>> => 
    api.get(`/variants/${id}`),
  
  create: (formData: FormData): Promise<ApiResponse<{ id: number }>> => 
    api.post('/variants', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  update: (id: number, formData: FormData): Promise<ApiResponse<void>> => 
    api.put(`/variants/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  delete: (id: number): Promise<ApiResponse<void>> => 
    api.delete(`/variants/${id}`)
};

export default api;