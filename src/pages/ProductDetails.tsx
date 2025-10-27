import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { variantAPI } from '../services/api';
import { Variant } from '../types';

const ProductDetail: React.FC = () => {
  const { variantId } = useParams<{ variantId: string }>();
  const navigate = useNavigate();
  const [variant, setVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPosition , setZoomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variantId) {
      fetchVariant(parseInt(variantId));
    }
  }, [variantId]);

  const fetchVariant = async (id: number): Promise<void> => {
  try {
    setLoading(true);
    const response = await variantAPI.getById(id);

    // Optional chaining to stay safe
    if (response.data?.success && response.data.data) {
      setVariant(response.data.data);
    } else {
      setError(response.data?.message || 'Variant not found');
    }
  } catch (err) {
    setError('Failed to fetch variant details');
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
};


  const handleBackClick = (): void => {
    navigate(-1);
  };

  const handleImageClick = (): void => {
    setIsZoomed(true);
  };

  const handleCloseZoom = (): void => {
    setIsZoomed(false);
  };

  const handleZoomMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!zoomContainerRef.current || !imageRef.current) return;

    const container = zoomContainerRef.current;
    const image = imageRef.current;
    
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });

    // Move the background image
    image.style.transformOrigin = `${x}% ${y}%`;
  };

  const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (imagePath.startsWith('http')) return imagePath;

  // Remove '/api' from backend URL if your images are served at /uploads
  const backendUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
  return `${backendUrl}${imagePath}`;
};


  const handleDownloadImage = async (): Promise<void> => {
    if (!variant?.image) return;

    try {
      const imageUrl = `${getImageUrl(variant.image)}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from URL or use a default name
      const filename = variant.image.split('/').pop() || `tile-${variant.size}.jpg`;
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

  const handleZoomIn = (): void => {
    if (imageRef.current) {
      const currentScale = parseFloat(imageRef.current.style.transform.replace('scale(', '').replace(')', '')) || 1;
      imageRef.current.style.transform = `scale(${Math.min(currentScale + 0.5, 3)})`;
    }
  };

  const handleZoomOut = (): void => {
    if (imageRef.current) {
      const currentScale = parseFloat(imageRef.current.style.transform.replace('scale(', '').replace(')', '')) || 1;
      imageRef.current.style.transform = `scale(${Math.max(currentScale - 0.5, 1)})`;
    }
  };

  const handleResetZoom = (): void => {
    if (imageRef.current) {
      imageRef.current.style.transform = 'scale(1)';
      setZoomPosition({ x: 50, y: 50 });
      imageRef.current.style.transformOrigin = '50% 50%';
    }
  };

  // Close zoom modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed]);

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

  if (!variant) {
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
          Back to Variants
        </button>

        {/* Product Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
                {variant.image ? (
                  <>
                    <img
                      src={getImageUrl(variant.image)}
                      alt={`${variant.size}`}
                      className="h-full w-full object-cover cursor-zoom-in transition-transform duration-200 hover:scale-105"
                      onClick={handleImageClick}
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/300/200';
                      }}
                    />
                    {/* Download button overlay */}
                    <button
                      onClick={handleDownloadImage}
                      className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      title="Download Image"
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    {/* Zoom hint */}
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      Click to zoom
                    </div>
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
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Product Details
              </h1>
              
              {/* Product Info (from parent product) */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Brand:</span>
                    <span className="text-gray-800 dark:text-white">{variant.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Series:</span>
                    <span className="text-gray-800 dark:text-white">{variant.series}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Code:</span>
                    <span className="text-gray-800 dark:text-white">{variant.code}</span>
                  </div>
                </div>
              </div>

              {/* Variant Specific Info */}
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Size:</span>
                  <span className="text-gray-600 dark:text-gray-400">{variant.size}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Pcs/Ctn:</span>
                  <span className="text-gray-600 dark:text-gray-400">{variant.pcsPerCtn}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">m²/Ctn:</span>
                  <span className="text-gray-600 dark:text-gray-400">{variant.m2PerCtn}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">kg/Ctn:</span>
                  <span className="text-gray-600 dark:text-gray-400">{variant.kgPerCtn}</span>
                </div>
                
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Stock:</span>
                  <span className={`font-semibold ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {variant.stock > 0 ? 'In stock' : 'Out of stock'} 
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                  Add to Cart
                </button>
                <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300">
                  Save for Later
                </button>
              </div>

              {/* Download button for mobile */}
              {variant.image && (
                <div className="mt-4 md:hidden">
                  <button
                    onClick={handleDownloadImage}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && variant.image && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-7xl max-h-screen">
            {/* Close button */}
            <button
              onClick={handleCloseZoom}
              className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Zoom controls */}
            <div className="absolute top-4 left-4 z-10 flex space-x-2">
              <button
                onClick={handleZoomIn}
                className="bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Zoom In"
              >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Zoom Out"
              >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
              </button>
              <button
                onClick={handleResetZoom}
                className="bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Reset Zoom"
              >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={handleDownloadImage}
                className="bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Download Image"
              >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>

            {/* Image container */}
            <div
              ref={zoomContainerRef}
              className="w-full h-full flex items-center justify-center overflow-hidden cursor-move"
              onMouseMove={handleZoomMove}
            >
              <img
                ref={imageRef}
                src={`http://localhost:5000${variant.image}`}
                alt={`${variant.size} - Zoomed`}
                className="max-w-full max-h-full object-contain transition-transform duration-150 ease-out"
                style={{ transform: 'scale(1)', transformOrigin: '50% 50%' }}
              />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
              Scroll to zoom • Drag to pan • Press ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;