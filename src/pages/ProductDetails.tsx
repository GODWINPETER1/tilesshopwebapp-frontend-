import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { variantAPI } from '../services/api';
import { Variant } from '../types';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { variantId } = useParams<{ variantId: string }>();
  const navigate = useNavigate();

  const [variant, setVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Image zoom
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPosition, setZoomPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 50,
    y: 50,
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // Cart
  const {
    items,
    cartItemCount,
    loading: cartLoading,
    error: cartError,
    addToCart,
  } = useCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [cartSuccess, setCartSuccess] = useState<string>('');
  const [cartErrorMessage, setCartErrorMessage] = useState<string>('');

  // =====================================================
  // Fetch variant
  // =====================================================

  useEffect(() => {
    if (variantId) {
      fetchVariant(parseInt(variantId, 10));
    }
  }, [variantId]);

  const fetchVariant = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError('');

      const response = await variantAPI.getById(id);

      if (response.data?.success && response.data.data) {
        setVariant(response.data.data);
      } else {
        setError(
          response.data?.message || 'Variant not found'
        );
      }
    } catch (err) {
      setError('Failed to fetch variant details');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Back
  // =====================================================

  const handleBackClick = (): void => {
    navigate(-1);
  };

  // =====================================================
  // Quantity
  // =====================================================

  const increaseQuantity = (): void => {

    setQuantity((current) => current + 1);

    setCartSuccess('');
    setCartErrorMessage('');

  };

  const decreaseQuantity = (): void => {
    setQuantity((current) =>
      Math.max(current - 1, 1)
    );

    setCartSuccess('');
    setCartErrorMessage('');
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (!variant) return;

    const value = parseInt(e.target.value, 10);

    if (Number.isNaN(value)) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.max(value , 1 ));

    setCartSuccess('');
    setCartErrorMessage('');
  };

  // =====================================================
  // Add to cart
  // =====================================================

  const handleAddToCart = async (): Promise<void> => {

    if (!variant) return;

    // if (variant.stock <= 0) {

    //   setCartErrorMessage('This product is currently out of stock.');
    //   return;
    // }

    // if (quantity > variant.stock) {

    //   setCartErrorMessage(`Only ${variant.stock} item(s) available in stock.`);
    //   return;

    // }

    try {

      setAddingToCart(true);
      setCartSuccess('');
      setCartErrorMessage('');

      await addToCart( variant.productId, variant.id, quantity );

      setCartSuccess(
        `${quantity} item${
          quantity > 1 ? 's' : ''
        } added to cart successfully.`
      );

      // Reset quantity after successful add
      setQuantity(1);

    } catch (err: any) {

      console.error('Add to cart error:', err );

      setCartErrorMessage(
        err?.message ||
          'Failed to add item to cart.'
      );
    } finally {
      setAddingToCart(false);
    }
  };


  const handleImageClick = (): void => {
    setIsZoomed(true);
    setZoomPosition({
      x: 50,
      y: 50,
    });

    if (imageRef.current) {
      imageRef.current.style.transform =
        'scale(1)';

      imageRef.current.style.transformOrigin =
        '50% 50%';
    }
  };

  const handleCloseZoom = (): void => {
    setIsZoomed(false);
  };

  const handleZoomMove = (
    e: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (
      !zoomContainerRef.current ||
      !imageRef.current
    ) {
      return;
    }

    const container =
      zoomContainerRef.current;

    const {
      left,
      top,
      width,
      height,
    } = container.getBoundingClientRect();

    const x =
      ((e.clientX - left) / width) * 100;

    const y =
      ((e.clientY - top) / height) * 100;

    setZoomPosition({
      x,
      y,
    });

    imageRef.current.style.transformOrigin =
      `${x}% ${y}%`;
  };

  const getImageUrl = (
    imagePath?: string | null
  ) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/400x400?text=No+Image';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const apiUrl =
      import.meta.env.VITE_API_URL ||
      'http://localhost:5000/api';

    const backendUrl =
      apiUrl.replace(/\/api$/, '');

    return `${backendUrl}${imagePath}`;
  };

  // =====================================================
  // Download image
  // =====================================================

  const handleDownloadImage =
    async (): Promise<void> => {
      if (!variant?.image) return;

      try {
        const imageUrl =
          getImageUrl(variant.image);

        const response =
          await fetch(imageUrl);

        if (!response.ok) {
          throw new Error(
            'Failed to download image'
          );
        }

        const blob =
          await response.blob();

        const url =
          window.URL.createObjectURL(blob);

        const link =
          document.createElement('a');

        link.href = url;

        const filename =
          variant.image
            .split('/')
            .pop() ||
          `tile-${variant.size}.jpg`;

        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

      } catch (err) {
        console.error(
          'Error downloading image:',
          err
        );

        alert(
          'Failed to download image. Please try again.'
        );
      }
    };

  // =====================================================
  // Zoom controls
  // =====================================================

  const handleZoomIn = (): void => {
    if (!imageRef.current) return;

    const currentScale =
      parseFloat(
        imageRef.current.style.transform
          .replace('scale(', '')
          .replace(')', '')
      ) || 1;

    const newScale =
      Math.min(
        currentScale + 0.5,
        3
      );

    imageRef.current.style.transform =
      `scale(${newScale})`;
  };

  const handleZoomOut = (): void => {
    if (!imageRef.current) return;

    const currentScale =
      parseFloat(
        imageRef.current.style.transform
          .replace('scale(', '')
          .replace(')', '')
      ) || 1;

    const newScale =
      Math.max(
        currentScale - 0.5,
        1
      );

    imageRef.current.style.transform =
      `scale(${newScale})`;
  };

  const handleResetZoom = (): void => {
    if (!imageRef.current) return;

    imageRef.current.style.transform =
      'scale(1)';

    imageRef.current.style.transformOrigin =
      '50% 50%';

    setZoomPosition({
      x: 50,
      y: 50,
    });
  };

  // =====================================================
  // Escape key
  // =====================================================

  useEffect(() => {
    const handleEscape = (
      e: KeyboardEvent
    ): void => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
      }
    };

    if (isZoomed) {
      document.addEventListener(
        'keydown',
        handleEscape
      );

      document.body.style.overflow =
        'hidden';
    }

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      );

      document.body.style.overflow =
        'unset';
    };
  }, [isZoomed]);

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">
          {error}
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

  // =====================================================
  // Current cart item
  // =====================================================

  const currentCartItem =
    items.find(
      (item) =>
        item.variantId === variant.id
    );

  const quantityInCart =
    currentCartItem?.quantity || 0;

  // const remainingStock =
  //   Math.max(
  //     variant.stock - quantityInCart,
  //     0
  //   );

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">

      <div className="container mx-auto px-4">

        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 cursor-pointer"
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

        {/* Product Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">

          <div className="md:flex">

            {/* ==========================================
                PRODUCT IMAGE
            ========================================== */}

            <div className="md:w-1/2">

              <div className="h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">

                {variant.image ? (
                  <>
                    <img
                      src={getImageUrl(
                        variant.image
                      )}
                      alt={variant.size}
                      className="h-full w-full object-cover cursor-zoom-in transition-transform duration-200 hover:scale-105"
                      onClick={
                        handleImageClick
                      }
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />

                    {
                      variant.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/45 flex items-center justify-center pointer-events-none">
                          <span className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide shadow-lg">
                            Out of Stock
                          </span>
                        </div>
                      )
                    }

                    {/* Download button */}
                    <button
                      onClick={
                        handleDownloadImage
                      }
                      className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      title="Download Image"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600 dark:text-gray-300"
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

                    {/* Zoom hint */}
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      Click to zoom
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 dark:text-gray-300 text-center">
                    <svg
                      className="w-24 h-24 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>

                    <p>No Image Available</p>
                  </div>
                )}

              </div>
            </div>

            {/* ==========================================
                PRODUCT INFORMATION
            ========================================== */}

            <div className="md:w-1/2 p-8">

              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Product Details
              </h1>

              {/* Product Information */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">

                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Product Information
                </h3>

                <div className="space-y-2 text-sm">

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Series:
                    </span>

                    <span className="text-gray-800 dark:text-white">
                      {variant.series}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      Code:
                    </span>

                    <span className="text-gray-800 dark:text-white">
                      {variant.code}
                    </span>
                  </div>

                </div>
              </div>

              {/* Variant Information */}
              <div className="space-y-4">

                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Size:
                  </span>

                  <span className="text-gray-600 dark:text-gray-400">
                    {variant.size}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Pcs/Ctn:
                  </span>

                  <span className="text-gray-600 dark:text-gray-400">
                    {variant.pcsPerCtn}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    m²/Ctn:
                  </span>

                  <span className="text-gray-600 dark:text-gray-400">
                    {variant.m2PerCtn}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    kg/Ctn:
                  </span>

                  <span className="text-gray-600 dark:text-gray-400">
                    {variant.kgPerCtn}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Stock:
                  </span>

                  <span
                    className={`font-semibold ${
                      variant.stock > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {variant.stock > 0
                      ? 'In stock'
                      : 'Out of stock'}
                  </span>
                </div>

              </div>

              {/* ==========================================
                  QUANTITY
              ========================================== */}

              {variant.stock > 0 && (
                <div className="mt-8">

                  <div className="flex items-center justify-between mb-2">

                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      Quantity
                    </span>

                    {quantityInCart > 0 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {quantityInCart} already in cart
                      </span>
                    )}

                  </div>

                  <div className="flex items-center">

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={quantity <= 1}
                      className="w-11 h-11 border border-gray-300 dark:border-gray-600 rounded-l-lg text-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min={1}
                      
                      value={quantity}
                      onChange={ handleQuantityChange }
                      className="w-16 h-11 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-center text-gray-800 dark:text-white outline-none"
                    />

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      
                      className="w-11 h-11 border border-gray-300 dark:border-gray-600 rounded-r-lg text-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +
                    </button>

                  </div>

                  {quantityInCart > 0 && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {remainingStock} remaining available to add.
                    </p>
                  )}

                </div>
              )}

              {/* ==========================================
                  CART FEEDBACK
              ========================================== */}

              {cartSuccess && (
                <div className="mt-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  ✓ {cartSuccess}
                </div>
              )}

              {cartErrorMessage && (
                <div className="mt-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {cartErrorMessage}
                </div>
              )}

              {cartError && !cartErrorMessage && (
                <div className="mt-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {cartError}
                </div>
              )}

              {/* ==========================================
                  ACTION BUTTONS
              ========================================== */}

              <div className="mt-8 flex flex-col sm:flex-row gap-4">

                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  disabled={
        
                    addingToCart ||
                    cartLoading
                  }
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {addingToCart ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Adding...
                    </>
                  )  : (
                    'Add to Cart'
                  )}
                </button>

                <button
                  type="button"
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
                >
                  Save for Later
                </button>

              </div>

              {/* Cart count */}
              {cartItemCount > 0 && (
                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Your cart currently has{' '}
                  <span className="font-semibold text-blue-600">
                    {cartItemCount}
                  </span>{' '}
                  item
                  {cartItemCount !== 1
                    ? 's'
                    : ''}
                </div>
              )}

              {/* Download button for mobile */}
              {variant.image && (
                <div className="mt-4 md:hidden">

                  <button
                    onClick={
                      handleDownloadImage
                    }
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>

                    Download Image
                  </button>

                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          ZOOM MODAL
      ================================================= */}

      {isZoomed && variant.image && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseZoom}
        >

          <div
            className="relative w-full h-full max-w-7xl max-h-screen"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Close */}
            <button
              onClick={
                handleCloseZoom
              }
              className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              title="Close"
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
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

            {/* Zoom controls */}
            <div className="absolute top-4 left-4 z-10 flex space-x-2">

              <button
                onClick={
                  handleZoomIn
                }
                className="bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Zoom In"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>

              <button
                onClick={
                  handleZoomOut
                }
                className="bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Zoom Out"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 12H6"
                  />
                </svg>
              </button>

              <button
                onClick={
                  handleResetZoom
                }
                className="bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Reset Zoom"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 014.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              <button
                onClick={
                  handleDownloadImage
                }
                className="bg-white dark:bg-gray-800 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Download Image"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
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

            </div>

            {/* Zoom image */}
            <div
              ref={zoomContainerRef}
              className="w-full h-full flex items-center justify-center overflow-hidden cursor-move"
              onMouseMove={
                handleZoomMove
              }
            >
              <img
                ref={imageRef}
                src={getImageUrl(
                  variant.image
                )}
                alt={`${variant.size} - Zoomed`}
                className="max-w-full max-h-full object-contain transition-transform duration-150 ease-out select-none"
                style={{
                  transform: 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
                draggable={false}
              />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              Use + / − to zoom • Move mouse to pan • Press ESC to close
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;