import React, { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import { Product } from '../../types';
import ProductForm from './productForm';

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await productAPI.getAll();
      if (response.data?.success && response.data?.data) {
        setProducts(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (): void => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product): void => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;

    // Remove '/api' from backend URL if your images are served at /uploads
    const backendUrl = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
    return `${backendUrl}${imagePath}`;
  };

  const handleDelete = async (productId: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(productId);
        await fetchProducts();
        alert('Product deleted successfully');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      }
    }
  };

  const handleFormClose = (): void => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = (): void => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600 dark:text-gray-300">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="manage-products">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Manage Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
        >
          Add New Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-700 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No products</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating a new product.</p>
          <button
            onClick={handleCreate}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-300"
          >
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-600"
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                ) : (
                  <div className="text-gray-400 dark:text-gray-300">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {product.name}
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Category:</span> {product.category || 'tiles'}
                  </p>
                  
                  {/* Show variant info if available */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Variants:</p>
                      {product.variants.slice(0, 2).map((variant, index) => (
                        <div key={index} className="text-xs text-gray-500 dark:text-gray-400">
                          • {variant.size} - {variant.code}
                        </div>
                      ))}
                      {product.variants.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{product.variants.length - 2} more variants
                        </div>
                      )}
                    </div>
                  )}
                  
                  {product.description && (
                    <p className="text-gray-500 dark:text-gray-400 truncate">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm font-medium transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ManageProducts;