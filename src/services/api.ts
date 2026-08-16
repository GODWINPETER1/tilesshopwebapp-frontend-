import axios, { AxiosResponse } from 'axios';
import { Product, Variant, ApiResponse , OtherProduct } from '../types';
import { CartData  } from '../types';



// Use VITE_API_URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL); // Debugging

const CART_SESSION_KEY = 'barongo_cart_session';

const getCartSessionId = (): string => {

  let sessionId = localStorage.getItem(CART_SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(CART_SESSION_KEY, sessionId);
}

return sessionId;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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

// Other Products API
// Other Products API
export const otherProductAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<OtherProduct[]>>> =>
    api.get('/other-products'),

  getById: (id: number): Promise<AxiosResponse<ApiResponse<OtherProduct>>> =>
    api.get(`/other-products/${id}`),

  create: (formData: FormData): Promise<AxiosResponse<ApiResponse<{ id: number }>>> =>
    api.post('/other-products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id: number, formData: FormData): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.put(`/other-products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> =>
    api.delete(`/other-products/${id}`),
};


export const cartAPI = {

  getCart: (): Promise<AxiosResponse<ApiResponse<CartData>>> =>
    api.get('/cart', {
      headers: {
        'X-Cart-Session': getCartSessionId(),
      },
    }),

  addItem: (
    productId: number,
    variantId: number,
    quantity: number = 1
  ): Promise<AxiosResponse<ApiResponse<CartData>>> =>
    api.post(
      '/cart/items',
      {
        productId,
        variantId,
        quantity,
      },
      {
        headers: {
          'X-Cart-Session': getCartSessionId(),
        },
      }
    ),

  updateItem: (
    itemId: number,
    quantity: number
  ): Promise<AxiosResponse<ApiResponse<CartData>>> =>
    api.put(
      `/cart/items/${itemId}`,
      {
        quantity,
      },
      {
        headers: {
          'X-Cart-Session': getCartSessionId(),
        },
      }
    ),

  removeItem: (
    itemId: number
  ): Promise<AxiosResponse<ApiResponse<CartData>>> =>
    api.delete(
      `/cart/items/${itemId}`,
      {
        headers: {
          'X-Cart-Session': getCartSessionId(),
        },
      }
    ),

  clear: (): Promise<AxiosResponse<ApiResponse<CartData>>> =>
    api.delete('/cart', {
      headers: {
        'X-Cart-Session': getCartSessionId(),
      },
    }),
};

// =====================================================
// Orders API
// =====================================================

export const orderAPI = {

  // =====================================================
  // CUSTOMER
  // =====================================================

  create: (
    customerName: string,
    phone: string,
    email: string,
    deliveryLocation: string,
    notes: string
  ): Promise<
    AxiosResponse<ApiResponse<any>>
  > =>
    api.post(
      '/orders',
      {
        customerName,
        phone,
        email,
        deliveryLocation,
        notes,
      },
      {
        headers: {
          'X-Cart-Session':
            getCartSessionId(),
        },
      }
    ),


  getByOrderNumber: (
    orderNumber: string
  ): Promise<
    AxiosResponse<ApiResponse<any>>
  > =>
    api.get(
      `/orders/number/${orderNumber}`
    ),


  // =====================================================
  // ADMIN
  // =====================================================

  getAll: (): Promise<
    AxiosResponse<ApiResponse<any[]>>
  > =>
    api.get('/orders/admin/all'),


  getById: (
    id: number
  ): Promise<
    AxiosResponse<ApiResponse<any>>
  > =>
    api.get(`/orders/admin/${id}`),


  updateStatus: (
    id: number,
    status: string
  ): Promise<
    AxiosResponse<ApiResponse<void>>
  > =>
    api.put(
      `/orders/admin/${id}/status`,
      {
        status,
      }
    ),

 
};





export default api;
