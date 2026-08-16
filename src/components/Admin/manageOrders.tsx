import React, { useEffect, useState } from 'react';

import {
  Eye,
  RefreshCw,
  Package,
  Clock,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';

import { orderAPI } from '../../services/api';


// =====================================================
// TYPES
// =====================================================

interface OrderItem {
  id: number;

  productId: number;
  variantId: number;

  productName: string;
  brand?: string | null;

  series?: string | null;
  code?: string | null;
  size?: string | null;

  pcsPerCtn?: number;
  m2PerCtn?: number;
  kgPerCtn?: number;

  tileType?: string | null;

  quantity: number;
}


interface Order {
  id: number;

  orderNumber: string;

  cartId: number;
  sessionId: string;

  customerName: string;
  phone: string;
  email?: string | null;

  deliveryLocation: string;

  notes?: string | null;

  status: string;

  createdAt: string;
  updatedAt: string;

  items?: OrderItem[];
}


// =====================================================
// COMPONENT
// =====================================================

const ManageOrders: React.FC = () => {

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [loadingOrder, setLoadingOrder] =
    useState(false);

  const [updatingStatus, setUpdatingStatus] =
  useState(false);


  // =====================================================
  // LOAD ORDERS
  // =====================================================

  const loadOrders = async () => {

    try {

      setLoading(true);
      setError(null);

      const response =
        await orderAPI.getAll();

      if (
        response.data.success &&
        response.data.data
      ) {

        setOrders(
          response.data.data
        );

      } else {

        setOrders([]);

      }

    } catch (err: any) {

      console.error(
        'Failed to load orders:',
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load orders'
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadOrders();

  }, []);


  // =====================================================
  // VIEW ORDER
  // =====================================================

  const handleViewOrder = async (
    order: Order
  ) => {

    try {

      setLoadingOrder(true);

      const response =
        await orderAPI.getByOrderNumber(
          order.orderNumber
        );

      if (
        response.data.success &&
        response.data.data
      ) {

        setSelectedOrder(
          response.data.data
        );

      } else {

        alert(
          response.data.message ||
          'Failed to load order'
        );

      }

    } catch (err: any) {

      console.error(
        'Failed to load order:',
        err
      );

      alert(
        err.response?.data?.message ||
        err.message ||
        'Failed to load order'
      );

    } finally {

      setLoadingOrder(false);

    }
  };


  const handleStatusChange = async (
  status: string
) => {

  if (!selectedOrder) {
    return;
  }


  try {

    setUpdatingStatus(true);

    const response =
      await orderAPI.updateStatus(
        selectedOrder.id,
        status
      );


    if (
      response.data.success
    ) {

      // Update modal immediately
      setSelectedOrder({
        ...selectedOrder,
        status,
      });


      // Update order in the list
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status,
              }
            : order
        )
      );

    } else {

      alert(
        response.data.message ||
        'Failed to update order status'
      );

    }

  } catch (err: any) {

    console.error(
      'Failed to update order status:',
      err
    );

    alert(
      err.response?.data?.message ||
      err.message ||
      'Failed to update order status'
    );

  } finally {

    setUpdatingStatus(false);

  }

};


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status: string
  ) => {

    switch (status.toLowerCase()) {

      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'confirmed':
        return 'bg-blue-100 text-blue-700';

      case 'processing':
        return 'bg-purple-100 text-purple-700';

      case 'completed':
        return 'bg-green-100 text-green-700';

      case 'cancelled':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';

    }
  };


  // =====================================================
  // LOADING ORDERS
  // =====================================================

  if (loading) {

    return (
      <div className="flex flex-col items-center justify-center py-16">

        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />

        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Loading orders...
        </p>

      </div>
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="py-10">

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">

          <p className="text-red-600 font-medium">
            {error}
          </p>

          <button
            onClick={loadOrders}
            className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

        </div>

      </div>
    );

  }


  // =====================================================
  // EMPTY
  // =====================================================

  if (orders.length === 0) {

    return (
      <div className="py-16 text-center">

        <Package
          size={48}
          className="mx-auto text-gray-400"
        />

        <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
          No Orders Yet
        </h3>

        <p className="text-gray-500 mt-2">
          Customer order requests will appear here.
        </p>

      </div>
    );

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Orders
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {orders.length}{' '}
            {orders.length === 1
              ? 'order'
              : 'orders'}{' '}
            received
          </p>

        </div>


        <button
          onClick={loadOrders}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >

          <RefreshCw size={16} />

          Refresh

        </button>

      </div>


      {/* =================================================
          ORDER LIST
      ================================================= */}

      <div className="space-y-4">

        {orders.map((order) => (

          <div
            key={order.id}
            className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-5"
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">


              {/* ORDER INFORMATION */}

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-3">

                  <h3 className="font-bold text-gray-900 dark:text-white">
                    #{order.orderNumber}
                  </h3>


                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>


                <div className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-2">

                  <div>

                    <p className="text-xs text-gray-500">
                      Customer
                    </p>

                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {order.customerName}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500">
                      Phone
                    </p>

                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {order.phone}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500">
                      Delivery Location
                    </p>

                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {order.deliveryLocation}
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-500">
                      Email
                    </p>

                    <p className="font-medium text-gray-800 dark:text-gray-200 break-all">
                      {order.email || 'Not provided'}
                    </p>

                  </div>

                </div>


                <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">

                  <Clock size={14} />

                  {new Date(
                    order.createdAt
                  ).toLocaleString()}

                </div>

              </div>


              {/* VIEW BUTTON */}

              <div className="flex-shrink-0">

                <button
                  type="button"
                  onClick={() =>
                    handleViewOrder(order)
                  }
                  disabled={loadingOrder}
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition disabled:opacity-50"
                >

                  {loadingOrder ? (

                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                      Loading...

                    </>

                  ) : (

                    <>
                      <Eye size={17} />

                      View Order
                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* =================================================
          ORDER DETAILS MODAL
      ================================================= */}

      {selectedOrder && (

        <div
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="bg-white dark:bg-gray-800 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">

              <div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Order Details
                </p>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  #{selectedOrder.orderNumber}
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300"
              >

                <X size={22} />

              </button>

            </div>


            {/* =================================================
                MODAL CONTENT
            ================================================= */}

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">


              {/* CUSTOMER INFORMATION */}

              <div className="mb-6">

                <div className="flex items-center gap-2 mb-4">

                  <User
                    size={19}
                    className="text-blue-600"
                  />

                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Customer Information
                  </h3>

                </div>


                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">


                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">

                    <p className="text-xs text-gray-500 mb-1">
                      Customer Name
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.customerName}
                    </p>

                  </div>


                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">

                      <Phone size={13} />

                      Phone

                    </div>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.phone}
                    </p>

                  </div>


                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">

                      <Mail size={13} />

                      Email

                    </div>

                    <p className="font-medium text-gray-900 dark:text-white break-all">
                      {selectedOrder.email || 'Not provided'}
                    </p>

                  </div>


                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">

                      <MapPin size={13} />

                      Delivery

                    </div>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.deliveryLocation}
                    </p>

                  </div>

                </div>

              </div>


              {/* NOTES */}

              {selectedOrder.notes && (

                <div className="mb-6">

                  <div className="flex items-center gap-2 mb-3">

                    <FileText
                      size={18}
                      className="text-blue-600"
                    />

                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Customer Notes
                    </h3>

                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">

                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedOrder.notes}
                    </p>

                  </div>

                </div>

              )}


              {/* ORDER ITEMS */}

              <div>

                <div className="flex items-center gap-2 mb-4">

                  <Package
                    size={19}
                    className="text-blue-600"
                  />

                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Ordered Products
                  </h3>

                </div>


                <div className="space-y-4">

                  {selectedOrder.items?.map(
                    (item) => (

                      <div
                        key={item.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-5"
                      >

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">


                          {/* PRODUCT */}

                          <div>

                            <h4 className="font-bold text-gray-900 dark:text-white">
                              {item.productName}
                            </h4>

                            <p className="text-sm text-gray-500 mt-1">
                              {item.brand || 'No brand'}
                            </p>

                          </div>


                          {/* QUANTITY */}

                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-4 py-2">

                            <p className="text-xs text-gray-500">
                              Quantity
                            </p>

                            <p className="text-lg font-bold text-blue-600">
                              {item.quantity}
                            </p>

                          </div>

                        </div>


                        {/* VARIANT DETAILS */}

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">


                          <div>

                            <p className="text-xs text-gray-500">
                              Series
                            </p>

                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {item.series || '-'}
                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Code
                            </p>

                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {item.code || '-'}
                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Size
                            </p>

                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {item.size || '-'}
                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Tile Type
                            </p>

                            <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                              {item.tileType || '-'}
                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Pcs / Carton
                            </p>

                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {item.pcsPerCtn ?? '-'}
                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              m² / Carton
                            </p>

                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {item.m2PerCtn ?? '-'}
                            </p>

                          </div>

                        </div>


                        {/* WEIGHT */}

                        <div className="mt-3">

                          <p className="text-xs text-gray-500">
                            Kg / Carton
                          </p>

                          <p className="font-medium text-gray-800 dark:text-gray-200">
                            {item.kgPerCtn ?? '-'}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* ORDER FOOTER */}

              <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>

                  <p className="text-xs text-gray-500">
                    Order Date
                  </p>

                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {new Date(
                      selectedOrder.createdAt
                    ).toLocaleString()}
                  </p>

                </div>


                <div className="flex flex-col sm:items-end gap-2">

  <label className="text-xs text-gray-500">
    Order Status
  </label>

  <select
    value={selectedOrder.status}
    disabled={updatingStatus}
    onChange={(e) =>
      handleStatusChange(e.target.value)
    }
    className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusClass(
      selectedOrder.status
    )}`}
  >

    <option value="pending">
      Pending
    </option>

    <option value="confirmed">
      Confirmed
    </option>

    <option value="processing">
      Processing
    </option>

    <option value="completed">
      Completed
    </option>

    <option value="cancelled">
      Cancelled
    </option>

  </select>


  {updatingStatus && (

    <div className="flex items-center gap-2 text-xs text-gray-500">

      <RefreshCw
        size={13}
        className="animate-spin"
      />

      Updating...

    </div>

  )}

</div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default ManageOrders;