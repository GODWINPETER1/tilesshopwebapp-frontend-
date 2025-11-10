import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { Product } from '../types';

const OtherProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    if (productId) {
      fetchProduct(parseInt(productId));
    }
  }, [productId]);

  const fetchProduct = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      if (response.data?.success && response.data?.data) {
        setProduct(response.data.data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to fetch product details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = (): void => {
    navigate(-1);
  };

  const handleDownloadImage = async (): Promise<void> => {
    if (!product?.image) return;

    try {
      const imageUrl = `http://localhost:5000${product.image}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      const filename = product.image.split('/').pop() || `${product.name}.jpg`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading image:', err);
      alert('Failed to download image. Please try again.');
    }
  };

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
          Go Back
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
          Go Back
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

        {/* Product Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
                {product.image ? (
                  <>
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="h-full w-full object-cover cursor-zoom-in transition-transform duration-200 hover:scale-105"
                      onClick={() => setIsZoomed(true)}
                    />
                    <button
                      onClick={handleDownloadImage}
                      className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      title="Download Image"
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="text-gray-400 dark:text-gray-300 text-center">
                    <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No Image Available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {product.name}
                </h1>
                <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full capitalize">
                  {product.category}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Brand:</span>
                  <span className="text-gray-600 dark:text-gray-400">{product.brand}</span>
                </div>
                
                {/* <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Series:</span>
                  <span className="text-gray-600 dark:text-gray-400">{product.series}</span>
                </div> */}
                
                {/* <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Code:</span>
                  <span className="text-gray-600 dark:text-gray-400">{product.code}</span>
                </div> */}
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                  Contact for Price
                </button>
                <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300">
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && product.image && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-screen">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherProductDetail;