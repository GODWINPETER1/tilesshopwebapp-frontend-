import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, variantAPI } from '../services/api';
import { Product, Variant } from '../types';

const VariantsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  useEffect(() => {
    if (productId) {
      fetchProductAndVariants(parseInt(productId));
    }
  }, [productId]);

  const fetchProductAndVariants = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      
      // Fetch product details
      const productResponse = await productAPI.getById(id);
      if (productResponse?.data?.success && productResponse.data.data) {
        setProduct(productResponse.data.data);
      }
      
      // Fetch variants
      const variantsResponse = await variantAPI.getByProductId(id);
      if (variantsResponse?.data?.success && variantsResponse.data.data) {
        const allVariants = variantsResponse.data.data;
        setVariants(allVariants);
        
        // Extract unique sizes
        const sizes = Array.from(new Set(allVariants.map(variant => variant.size))).filter(Boolean);
        setAvailableSizes(['all', ...sizes]);
      }
    } catch (err) {
      setError('Failed to fetch product details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;

  // Use backend URL from environment
  const backendUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
  return `${backendUrl}${imagePath}`;
};

  const handleVariantClick = (variantId: number): void => {
    navigate(`/product/${variantId}`);
  };

  const handleBackClick = (): void => {
    navigate('/');
  };

  const handleSizeClick = (size: string): void => {
    setSelectedSize(size);
  };

  // Filter variants based on selected size
  const filteredVariants = selectedSize === 'all' 
    ? variants 
    : variants.filter(variant => variant.size === selectedSize);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={handleBackClick}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Product not found</p>
        <button 
          onClick={handleBackClick}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>

        {/* Product Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {product.name}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-300">Brand:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{product.brand}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-300">Series:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{product.series}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-300">Code:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{product.code}</span>
            </div>
          </div>
          {product.description && (
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              {product.description}
            </p>
          )}
        </div>

        {/* Size Filter */}
        {availableSizes.length > 1 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Available Sizes
            </h2>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeClick(size)}
                  className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {size === 'all' ? 'All Sizes' : size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Variants Grid */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {selectedSize === 'all' ? 'All Variants' : `${selectedSize} Variants`}
        </h2>
        
        {filteredVariants.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              {selectedSize === 'all' 
                ? 'No variants available for this product.' 
                : `No variants available in ${selectedSize} size.`
              }
            </p>
            {selectedSize !== 'all' && (
              <button
                onClick={() => setSelectedSize('all')}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all sizes
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredVariants.map((variant: Variant) => (
              <div
                key={variant.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => handleVariantClick(variant.id)}
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {variant.image ? (
                    <img
                      src={getImageUrl(variant.image)}
                      alt={`${variant.size}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/300/200';
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
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {variant.size}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Series:</span> {variant.series}
                    </p>
                    {/* <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">m²/Ctn:</span> {variant.m2PerCtn}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium">kg/Ctn:</span> {variant.kgPerCtn}
                    </p> */}
                    <p className={`text-sm ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="font-medium">Stock:</span> {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show count */}
        {filteredVariants.length > 0 && (
          <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
            Showing {filteredVariants.length} variant{filteredVariants.length !== 1 ? 's' : ''}
            {selectedSize !== 'all' && ` in ${selectedSize} size`}
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantsPage;