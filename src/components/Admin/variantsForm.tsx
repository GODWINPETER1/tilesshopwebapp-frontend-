import React, { useState, useEffect } from 'react';
import { Variant, Product } from '../../types';
import { variantAPI } from '../../services/api';

interface VariantFormProps {
  variant: Variant | null;
  products: Product[];
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  product_id: string;
  series: string;
  code: string;
  size: string;
  pcs_per_ctn: string;
  m2_per_ctn: string;
  kg_per_ctn: string;
  stock: string;
  tile_type: string; // ADD THIS
  image: File | null;
}

const VariantForm: React.FC<VariantFormProps> = ({ variant, products, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    product_id: '',
    series: '',
    code: '',
    size: '',
    pcs_per_ctn: '',
    m2_per_ctn: '',
    kg_per_ctn: '',
    stock: '',
    tile_type: 'non-slide', // DEFAULT VALUE
    image: null
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (variant) {
      setFormData({
        product_id: variant.productId.toString(),
        series: variant.series || '',
        code: variant.code || '',
        size: variant.size || '',
        pcs_per_ctn: variant.pcsPerCtn.toString(),
        m2_per_ctn: variant.m2PerCtn.toString(),
        kg_per_ctn: variant.kgPerCtn.toString(),
        stock: variant.stock.toString(),
        tile_type: variant.tileType || 'non-slide', // ADD THIS
        image: null
      });
      if (variant.image) {
        const backendUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
        setImagePreview(`${backendUrl}${variant.image}`);
      }
    }
  }, [variant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.product_id) {
      newErrors.product_id = 'Product is required';
    }
    if (!formData.series.trim()) {
      newErrors.series = 'Series is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Product code is required';
    }
    if (!formData.size.trim()) {
      newErrors.size = 'Size is required';
    }
    if (!formData.pcs_per_ctn || parseInt(formData.pcs_per_ctn) < 0) {
      newErrors.pcs_per_ctn = 'Valid Pcs/Ctn is required';
    }
    if (!formData.m2_per_ctn || parseFloat(formData.m2_per_ctn) < 0) {
      newErrors.m2_per_ctn = 'Valid m²/Ctn is required';
    }
    if (!formData.kg_per_ctn || parseFloat(formData.kg_per_ctn) < 0) {
      newErrors.kg_per_ctn = 'Valid kg/Ctn is required';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('product_id', formData.product_id);
      formDataToSend.append('series', formData.series);
      formDataToSend.append('code', formData.code);
      formDataToSend.append('size', formData.size);
      formDataToSend.append('pcs_per_ctn', formData.pcs_per_ctn);
      formDataToSend.append('m2_per_ctn', formData.m2_per_ctn);
      formDataToSend.append('kg_per_ctn', formData.kg_per_ctn);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('tile_type', formData.tile_type); // ADD THIS
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (variant) {
        await variantAPI.update(variant.id, formDataToSend);
        alert('Variant updated successfully');
      } else {
        await variantAPI.create(formDataToSend);
        alert('Variant created successfully');
      }
      onSuccess();
    } catch (err: any) {
      console.error('Error saving variant:', err);
      alert(`Failed to save variant: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {variant ? 'Edit Variant' : 'Create Variant'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Selection */}
          <div>
            <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product *
            </label>
            <select
              id="product_id"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.product_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.brand})
                </option>
              ))}
            </select>
            {errors.product_id && <p className="mt-1 text-sm text-red-600">{errors.product_id}</p>}
          </div>

          {/* Series and Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="series" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Series *
              </label>
              <input
                type="text"
                id="series"
                name="series"
                value={formData.series}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.series ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter series name"
              />
              {errors.series && <p className="mt-1 text-sm text-red-600">{errors.series}</p>}
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Code *
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product code"
              />
              {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
            </div>
          </div>

          {/* Size */}
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Size *
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.size ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 10x20, 30x60, etc."
            />
            {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size}</p>}
          </div>

          {/* Pcs/Ctn, m²/Ctn, kg/Ctn */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="pcs_per_ctn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pcs/Ctn *
              </label>
              <input
                type="number"
                id="pcs_per_ctn"
                name="pcs_per_ctn"
                value={formData.pcs_per_ctn}
                onChange={handleChange}
                min="0"
                step="1"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.pcs_per_ctn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.pcs_per_ctn && <p className="mt-1 text-sm text-red-600">{errors.pcs_per_ctn}</p>}
            </div>
            <div>
              <label htmlFor="m2_per_ctn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                m²/Ctn *
              </label>
              <input
                type="number"
                id="m2_per_ctn"
                name="m2_per_ctn"
                value={formData.m2_per_ctn}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.m2_per_ctn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.m2_per_ctn && <p className="mt-1 text-sm text-red-600">{errors.m2_per_ctn}</p>}
            </div>
            <div>
              <label htmlFor="kg_per_ctn" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                kg/Ctn *
              </label>
              <input
                type="number"
                id="kg_per_ctn"
                name="kg_per_ctn"
                value={formData.kg_per_ctn}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.kg_per_ctn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.kg_per_ctn && <p className="mt-1 text-sm text-red-600">{errors.kg_per_ctn}</p>}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>

          {/* Tile Type */}
          <div>
            <label htmlFor="tile_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tile Type *
            </label>
            <select
              id="tile_type"
              name="tile_type"
              value={formData.tile_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="non-slide">Non-Slide Tiles</option>
              <option value="slide">Slide Tiles</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Variant Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                variant ? 'Update Variant' : 'Create Variant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VariantForm;