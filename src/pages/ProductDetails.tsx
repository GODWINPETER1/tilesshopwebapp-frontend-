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

  // Zoom states
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

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

      if (response.data?.success && response.data.data) {
        setVariant(response.data.data);
      } else {
        setError(response.data?.message || 'Variant not found');
      }
    } catch (err) {
      setError('Failed to fetch variant details');
      console.error(err);
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

    // Reset zoom
    setZoomScale(1);
    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  const handleZoomMove = (
    e: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (!zoomContainerRef.current || zoomScale === 1) return;

    const container = zoomContainerRef.current;

    const { left, top, width, height } =
      container.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const handleWheelZoom = (
    e: React.WheelEvent<HTMLDivElement>
  ): void => {
    e.preventDefault();

    if (e.deltaY < 0) {
      setZoomScale((prev) => Math.min(prev + 0.2, 5));
    } else {
      setZoomScale((prev) => Math.max(prev - 0.2, 1));
    }
  };

  const handleZoomIn = (): void => {
    setZoomScale((prev) => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = (): void => {
    setZoomScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = (): void => {
    setZoomScale(1);

    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  const getImageUrl = (
    imagePath?: string | null
  ): string => {
    if (!imagePath) {
      return 'https://via.placeholder.com/400x400?text=No+Image';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const backendUrl =
      import.meta.env.VITE_API_URL?.replace(/\/api$/, '') ||
      'http://localhost:5000';

    return `${backendUrl}${imagePath}`;
  };

  const handleDownloadImage = async (): Promise<void> => {
    if (!variant?.image) return;

    try {
      const imageUrl = getImageUrl(variant.image);

      const response = await fetch(imageUrl);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;

      const filename =
        variant.image.split('/').pop() ||
        `tile-${variant.size}.jpg`;

      link.download = filename;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      alert('Failed to download image');
    }
  };

  // ESC close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        handleCloseZoom();
      }
    };

    if (isZoomed) {
      document.addEventListener('keydown', handleEscape);

      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      );

      document.body.style.overflow = 'unset';
    };
  }, [isZoomed]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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
        <p className="text-red-500 text-lg">
          Product not found
        </p>

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

        {/* Back */}
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>

          Back to Variants
        </button>

        {/* Product */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">

            {/* Image */}
            <div className="md:w-1/2">
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700 overflow-hidden">

                {variant.image ? (
                  <>
                    <img
                      src={getImageUrl(variant.image)}
                      alt={variant.size}
                      onClick={handleImageClick}
                      className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-105"
                    />

                    {/* Download */}
                    <button
                      onClick={handleDownloadImage}
                      className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <svg
                        className="w-5 h-5 text-gray-700 dark:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>

                    {/* Hint */}
                    <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      Click to zoom
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md:w-1/2 p-8">

              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Product Details
              </h1>

              <div className="space-y-4">

                <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Series
                  </span>

                  <span className="text-gray-600 dark:text-gray-400">
                    {variant.series}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Code
                  </span>

                  <span className="text-gray-600 dark:text-gray-400">
                    {variant.code}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Size
                  </span>

                  <span className="text-gray-600 dark:text-gray-400">
                    {variant.size}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Stock
                  </span>

                  <span
                    className={`font-semibold ${
                      variant.stock > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {variant.stock > 0
                      ? 'In Stock'
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZOOM MODAL */}
      {isZoomed && variant.image && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">

          <div className="relative w-full h-full max-w-7xl">

            {/* Close */}
            <button
              onClick={handleCloseZoom}
              className="absolute top-4 right-4 z-20 bg-white dark:bg-gray-800 p-2 rounded-full"
            >
              <svg
                className="w-6 h-6 text-black dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Controls */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">

              <button
                onClick={handleZoomIn}
                className="bg-white dark:bg-gray-800 p-2 rounded-full"
              >
                +
              </button>

              <button
                onClick={handleZoomOut}
                className="bg-white dark:bg-gray-800 p-2 rounded-full"
              >
                -
              </button>

              <button
                onClick={handleResetZoom}
                className="bg-white dark:bg-gray-800 p-2 rounded-full"
              >
                Reset
              </button>
            </div>

            {/* Zoom Area */}
            <div
              ref={zoomContainerRef}
              onMouseMove={handleZoomMove}
              onWheel={handleWheelZoom}
              className="w-full h-full overflow-hidden flex items-center justify-center"
            >
              <img
                ref={imageRef}
                src={getImageUrl(variant.image)}
                alt={variant.size}
                draggable={false}
                className="max-w-full max-h-full object-contain select-none transition-transform duration-100"
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  cursor:
                    zoomScale > 1
                      ? 'move'
                      : 'zoom-in',
                }}
              />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              Scroll to zoom • Move mouse to pan • ESC to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;