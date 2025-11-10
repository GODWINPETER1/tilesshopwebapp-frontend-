// Product and Variant types - UPDATED FOR NEW STRUCTURE
export interface Product {
  id: number;
  name: string;
  brand: string;
  image: string | null;
  description: string;
  category: string; 
  variants?: Variant[]; // Variants now contain series and code
}

export interface Variant {
  id: number;
  productId: number;
  series: string;
  code: string;
  size: string;
  pcsPerCtn: number;
  m2PerCtn: number;
  kgPerCtn: number;
  image: string | null;
  stock: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Form Data types - UPDATED
export interface ProductFormData {
  name: string;
  brand: string;
  description: string;
  category: string;
  mainImage?: File | null;
  // REMOVED: series and code (now in variants)
}

export interface VariantFormData {
  product_id: string;
  series: string; // ADDED: series now in variant
  code: string;   // ADDED: code now in variant
  size: string;
  pcs_per_ctn: string;
  m2_per_ctn: string;
  kg_per_ctn: string;
  stock: string;
  image?: File | null;
}

// Admin types
export interface AdminProduct extends Product {
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
}

export interface AdminVariant extends Variant {
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
}