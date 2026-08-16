import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';

import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';

interface OrderItem {
  id: number;
  productId: number;
  variantId: number;
  productName: string;
  brand?: string;
  series?: string;
  code?: string;
  size?: string;
  pcsPerCtn?: number;
  m2PerCtn?: string | number;
  kgPerCtn?: string | number;
  tileType?: string;
  quantity: number;
}

interface Order {
  id: number;
  orderNumber: string;
  cartId: number;
  sessionId: string;

  customerName: string;
  phone: string;
  email?: string;
  deliveryLocation: string;
  notes?: string;

  status: string;

  createdAt?: string;
  updatedAt?: string;

  items: OrderItem[];
}

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();

  const { orderNumber } = useParams<{
    orderNumber: string;
  }>();

  const { resetCartState } = useCart();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  // =====================================================
  // LOAD ORDER
  // =====================================================

  useEffect(() => {
    const loadOrder = async () => {

      if (!orderNumber) {
        setError('Order number is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await orderAPI.getByOrderNumber(
            orderNumber
          );

        if (
          response.data.success &&
          response.data.data
        ) {
          setOrder(response.data.data);

          // The backend already changed
          // the cart to "submitted".
          //
          // We only clear the React state.
          resetCartState();

          return;
        }

        throw new Error(
          response.data.message ||
            'Order not found.'
        );

      } catch (err: any) {

        console.error(
          'Failed to load order:',
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load order.'
        );

      } finally {
        setLoading(false);
      }
    };

    loadOrder();

  }, [orderNumber, resetCartState]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">

        <div className="text-center">

          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading your order...
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">

        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">

          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">

            <Package
              size={30}
              className="text-red-600"
            />

          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-5">
            Order Not Found
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {error ||
              'We could not find this order.'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Back to Products
          </button>

        </div>

      </div>
    );
  }


  // =====================================================
  // SUCCESS PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        <div className="text-center mb-8">

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">

            <CheckCircle
              size={46}
              className="text-green-600"
            />

          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-5">
            Order Request Submitted!
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            Thank you for your request. Our team will
            contact you regarding your order.
          </p>

          {/* Order number */}

          <div className="inline-flex items-center gap-2 mt-5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-5 py-3 rounded-lg">

            <Package size={18} />

            <span className="font-semibold">
              Order #{order.orderNumber}
            </span>

          </div>

        </div>


        <div className="grid lg:grid-cols-3 gap-6">

          {/* =================================================
              CUSTOMER INFORMATION
          ================================================= */}

          <div className="lg:col-span-1">

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                Customer Information
              </h2>


              <div className="space-y-5">

                {/* Name */}

                <div className="flex gap-3">

                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">

                    <Package
                      size={18}
                      className="text-gray-600 dark:text-gray-300"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Name
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.customerName}
                    </p>

                  </div>

                </div>


                {/* Phone */}

                <div className="flex gap-3">

                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">

                    <Phone
                      size={18}
                      className="text-gray-600 dark:text-gray-300"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Phone
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.phone}
                    </p>

                  </div>

                </div>


                {/* Email */}

                {order.email && (
                  <div className="flex gap-3">

                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">

                      <Mail
                        size={18}
                        className="text-gray-600 dark:text-gray-300"
                      />

                    </div>

                    <div className="min-w-0">

                      <p className="text-xs text-gray-500">
                        Email
                      </p>

                      <p className="font-medium text-gray-900 dark:text-white break-words">
                        {order.email}
                      </p>

                    </div>

                  </div>
                )}


                {/* Location */}

                <div className="flex gap-3">

                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">

                    <MapPin
                      size={18}
                      className="text-gray-600 dark:text-gray-300"
                    />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Delivery Location
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.deliveryLocation}
                    </p>

                  </div>

                </div>

              </div>


              {/* Notes */}

              {order.notes && (
                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-5">

                  <p className="text-xs text-gray-500 mb-1">
                    Notes
                  </p>

                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {order.notes}
                  </p>

                </div>
              )}

            </div>

          </div>


          {/* =================================================
              ORDER ITEMS
          ================================================= */}

          <div className="lg:col-span-2">

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Requested Products
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {order.items.length}{' '}
                    {order.items.length === 1
                      ? 'product'
                      : 'products'}
                  </p>

                </div>

                <ShoppingBag
                  size={22}
                  className="text-blue-600"
                />

              </div>


              <div className="space-y-4">

                {order.items.map((item) => (

                  <div
                    key={item.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                  >

                    <div className="flex justify-between gap-4">

                      <div className="min-w-0">

                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.productName}
                        </h3>


                        {item.brand && (
                          <p className="text-sm text-gray-500 mt-1">
                            Brand: {item.brand}
                          </p>
                        )}


                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">

                          {item.series && (
                            <span>
                              Series: {item.series}
                            </span>
                          )}

                          {item.code && (
                            <span>
                              Code: {item.code}
                            </span>
                          )}

                          {item.size && (
                            <span>
                              Size: {item.size}
                            </span>
                          )}

                        </div>

                      </div>


                      {/* Quantity */}

                      <div className="text-right flex-shrink-0">

                        <p className="text-xs text-gray-500">
                          Quantity
                        </p>

                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {item.quantity}
                        </p>

                      </div>

                    </div>


                    {/* Product details */}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">

                      {item.pcsPerCtn !== undefined && (
                        <div>

                          <p className="text-xs text-gray-500">
                            Pcs / Carton
                          </p>

                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.pcsPerCtn}
                          </p>

                        </div>
                      )}


                      {item.m2PerCtn !== undefined && (
                        <div>

                          <p className="text-xs text-gray-500">
                            m² / Carton
                          </p>

                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.m2PerCtn}
                          </p>

                        </div>
                      )}


                      {item.kgPerCtn !== undefined && (
                        <div>

                          <p className="text-xs text-gray-500">
                            Kg / Carton
                          </p>

                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.kgPerCtn}
                          </p>

                        </div>
                      )}


                      {item.tileType && (
                        <div>

                          <p className="text-xs text-gray-500">
                            Type
                          </p>

                          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {item.tileType}
                          </p>

                        </div>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >

            <ShoppingBag size={18} />

            Continue Shopping

          </button>


          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold transition"
          >

            <ArrowLeft size={18} />

            Back to Home

          </button>

        </div>


        {/* Reference */}

        <p className="text-center text-xs text-gray-400 mt-6">

          Please keep your order number for reference:

          <span className="font-semibold ml-1">
            {order.orderNumber}
          </span>

        </p>

      </div>

    </div>
  );
};

export default OrderConfirmation;