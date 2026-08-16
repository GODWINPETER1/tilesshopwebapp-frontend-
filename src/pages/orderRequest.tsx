import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';

const OrderRequest: React.FC = () => {
  const navigate = useNavigate();

  const {
    items,
    cartItemCount,
    loading: cartLoading,
  } = useCart();

  const [customerName, setCustomerName] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [deliveryLocation, setDeliveryLocation] =
    useState('');

  const [notes, setNotes] =
    useState('');

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  // =====================================================
  // Submit order
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError(null);


    if (!customerName.trim()) {
      setError('Please enter your full name.');
      return;
    }


    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }


    if (!deliveryLocation.trim()) {
      setError(
        'Please enter your delivery location.'
      );
      return;
    }


    if (items.length === 0) {
      setError(
        'Your cart is empty.'
      );
      return;
    }


    try {
      setSubmitting(true);

      const response =
        await orderAPI.create(
          customerName.trim(),
          phone.trim(),
          email.trim(),
          deliveryLocation.trim(),
          notes.trim()
        );


      if (
        response.data.success &&
        response.data.data
      ) {
        const orderNumber =
          response.data.data.orderNumber;

        navigate(
          `/order-confirmation/${orderNumber}`,
          {
            replace: true,
          }
        );

        return;
      }


      throw new Error(
        response.data.message ||
        'Failed to submit order.'
      );

    } catch (err: any) {

      console.error(
        'Order submission error:',
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to submit order. Please try again.'
      );

    } finally {
      setSubmitting(false);
    }
  };


  // =====================================================
  // Loading
  // =====================================================

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">

        <div className="text-center">

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your cart is empty
          </h1>

          <p className="mt-2 text-gray-500">
            Add some products before requesting an order.
          </p>

          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Browse Products
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-5"
          >
            ← Back to Cart
          </button>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Request an Order
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Provide your details and we will contact you regarding your request.
          </p>

        </div>


        <div className="grid lg:grid-cols-3 gap-8">

          {/* =================================================
              CUSTOMER FORM
          ================================================= */}

          <div className="lg:col-span-2">

            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8"
            >

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Customer Information
              </h2>


              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
                  {error}
                </div>
              )}


              {/* Name */}

              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                  <span className="text-red-500">
                    {' '}*
                  </span>
                </label>

                <input
                  type="text"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={submitting}
                />

              </div>


              {/* Phone */}

              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                  <span className="text-red-500">
                    {' '}*
                  </span>
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="e.g. 0712345678"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={submitting}
                />

              </div>


              {/* Email */}

              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                  <span className="text-gray-400 text-xs ml-2">
                    Optional
                  </span>
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={submitting}
                />

              </div>


              {/* Location */}

              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delivery Location
                  <span className="text-red-500">
                    {' '}*
                  </span>
                </label>

                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) =>
                    setDeliveryLocation(e.target.value)
                  }
                  placeholder="e.g. Mikocheni, Dar es Salaam"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={submitting}
                />

              </div>


              {/* Notes */}

              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                  <span className="text-gray-400 text-xs ml-2">
                    Optional
                  </span>
                </label>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  rows={4}
                  placeholder="Any additional information..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={submitting}
                />

              </div>


              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-lg font-semibold transition"
              >
                {submitting
                  ? 'Submitting Request...'
                  : 'Submit Order Request'}
              </button>


              <p className="text-xs text-center text-gray-500 mt-4">
                No prices are displayed. Our team will contact you regarding your request.
              </p>

            </form>

          </div>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-6">

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Request Summary
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {cartItemCount}{' '}
                {cartItemCount === 1
                  ? 'item'
                  : 'items'}
              </p>


              <div className="mt-6 space-y-4">

                {items.map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-3"
                  >

                    <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">

                      {(item.variantImage ||
                        item.productImage) ? (

                        <img
                          src={
                            item.variantImage ||
                            item.productImage ||
                            ''
                          }
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>

                      )}

                    </div>


                    <div className="min-w-0 flex-1">

                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {item.productName}
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.series} • {item.size}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Quantity: {item.quantity}
                      </p>

                    </div>

                  </div>

                ))}

              </div>


              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-5">

                <div className="flex justify-between">

                  <span className="font-semibold text-gray-900 dark:text-white">
                    Total Items
                  </span>

                  <span className="font-bold text-gray-900 dark:text-white">
                    {cartItemCount}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderRequest;