import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    items,
    loading,
    error,
    cartItemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [updatingItem, setUpdatingItem] =
    useState<number | null>(null);

  const [removingItem, setRemovingItem] =
    useState<number | null>(null);

  const [clearingCart, setClearingCart] =
    useState(false);

  // =====================================================
  // Update quantity
  // =====================================================

  const handleUpdateQuantity = async (
    itemId: number,
    quantity: number,
    stock: number
  ) => {
    if (quantity < 1) {
      return;
    }

    if (quantity > stock) {
      return;
    }

    try {
      setUpdatingItem(itemId);

      await updateQuantity(
        itemId,
        quantity
      );
    } catch (err) {
      console.error(
        'Failed to update quantity:',
        err
      );
    } finally {
      setUpdatingItem(null);
    }
  };

  // =====================================================
  // Remove item
  // =====================================================

  const handleRemove = async (
    itemId: number
  ) => {
    try {
      setRemovingItem(itemId);

      await removeFromCart(itemId);
    } catch (err) {
      console.error(
        'Failed to remove item:',
        err
      );
    } finally {
      setRemovingItem(null);
    }
  };

  // =====================================================
  // Clear cart
  // =====================================================

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to remove all items from your cart?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setClearingCart(true);

      await clearCart();
    } catch (err) {
      console.error(
        'Failed to clear cart:',
        err
      );
    } finally {
      setClearingCart(false);
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">

          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading your cart...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // Empty cart
  // =====================================================

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

        <div className="max-w-5xl mx-auto px-4 py-12">

          {/* Header */}
          <div className="flex items-center justify-between mb-10">

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>

              Continue Shopping
            </button>

          </div>

          {/* Empty state */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-10 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">

              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l-2-9m-5 0v9"
                />
              </svg>

            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              Your cart is empty
            </h1>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              You haven't added any products to your cart yet.
            </p>

            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Browse Products
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // Cart
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
            </h1>

            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {cartItemCount}{' '}
              {cartItemCount === 1
                ? 'item'
                : 'items'}{' '}
              in your cart
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>

            Continue Shopping
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="lg:col-span-2 space-y-4">

            {/* Clear cart */}
            <div className="flex justify-end">

              <button
                onClick={handleClearCart}
                disabled={clearingCart}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {clearingCart
                  ? 'Clearing...'
                  : 'Clear Cart'}
              </button>

            </div>

            {items.map((item) => (

              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5"
              >

                <div className="flex flex-col sm:flex-row gap-5">

                  {/* Product visual */}
                  <div className="w-full sm:w-28 h-28 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                      {(
                        item.variantImage ||
                        item.productImage
                      ) ? (
                        <img
                          src={
                            item.variantImage ||
                            item.productImage ||
                            ''
                          }
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>

                  {/* Product information */}
                  <div className="flex-1 min-w-0">

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                      <div>

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.productName}
                        </h2>

                        {item.brand && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Brand: {item.brand}
                          </p>
                        )}

                      </div>

                      <button
                        onClick={() =>
                          handleRemove(item.id)
                        }
                        disabled={
                          removingItem === item.id
                        }
                        className="self-start text-sm text-red-500 hover:text-red-600 disabled:opacity-50"
                      >
                        {removingItem === item.id
                          ? 'Removing...'
                          : 'Remove'}
                      </button>

                    </div>

                    {/* Variant information */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">

                      <div>
                        <p className="text-xs text-gray-400">
                          Series
                        </p>

                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {item.series || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Code
                        </p>

                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {item.code || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Size
                        </p>

                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {item.size || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Type
                        </p>

                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">
                          {item.tileType || '-'}
                        </p>
                      </div>

                    </div>

                    {/* Packaging */}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">

                      <span>
                        {item.pcsPerCtn} pcs/ctn
                      </span>

                      <span>
                        {item.m2PerCtn} m²/ctn
                      </span>

                      <span>
                        {item.kgPerCtn} kg/ctn
                      </span>

                    </div>

                    {/* Quantity */}
                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div>

                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Quantity
                        </p>

                        <div className="flex items-center">

                          <button
                            type="button"
                            disabled={
                              item.quantity <= 1 ||
                              updatingItem === item.id
                            }
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity - 1,
                                item.stock
                              )
                            }
                            className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-l-lg text-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            −
                          </button>

                          <div className="w-14 h-10 border-y border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm font-semibold text-gray-800 dark:text-white">
                            {updatingItem === item.id
                              ? '...'
                              : item.quantity}
                          </div>

                          <button
                            type="button"
                            disabled={
                              item.quantity >=
                                item.stock ||
                              updatingItem === item.id
                            }
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.quantity + 1,
                                item.stock
                              )
                            }
                            className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-r-lg text-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            +
                          </button>

                        </div>

                      </div>

                      {/* Stock */}
                      <div className="text-sm">

                        <span className="text-gray-500 dark:text-gray-400">
                          Available stock:{' '}
                        </span>

                        <span className="font-semibold text-green-600">
                          {item.stock}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* =================================================
              CART SUMMARY
          ================================================= */}

          <div className="lg:col-span-1">

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-6">

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Cart Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-gray-600 dark:text-gray-300">

                  <span>
                    Total items
                  </span>

                  <span className="font-semibold">
                    {cartItemCount}
                  </span>

                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">

                  <div className="flex justify-between">

                    <span className="font-semibold text-gray-900 dark:text-white">
                      Products
                    </span>

                    <span className="font-semibold text-gray-900 dark:text-white">
                      {items.length}
                    </span>

                  </div>

                </div>

              </div>

              {/* Checkout */}
              <button
                onClick={() => navigate('/order-request')}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Proceed to Request Order
              </button>

              <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                Prices are not displayed on this website.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CartPage;