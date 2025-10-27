// Product and Variant types
export interface Product {
  id: number;
  name: string;
  brand: string;
  series: string;
  code: string;
  image: string | null;
  description: string;
  category: string; 
  variants?: Variant[];
}

export interface Variant {
  id: number;
  productId: number;
  // Inherited from product
  brand: string;
  series: string;
  code: string;
  // Variant specific fields
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
  data: T;
  error?: string;
}

// Form Data types
export interface ProductFormData {
  name: string;
  brand: string;
  series: string;
  code: string;
  description: string;
  category: string
  mainImage?: File | null;
}

export interface VariantFormData {
  product_id: string;
  size: string;
  pcs_per_ctn: string;
  m2_per_ctn: string;
  kg_per_ctn: string;
  stock: string;
  image?: File | null;
}

// Admin types
export interface ProductFormData {
  name: string;
  brand: string;
  series: string;
  code: string;
  description: string;
  mainImage?: File | null;
}



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