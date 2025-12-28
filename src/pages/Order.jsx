import React, { useState, useEffect } from 'react';
import OrderCard from '../components/Order';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null); // For Modal
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingList, setLoadingList] = useState(true);


  const nextStatusMap = {
    pending: { label: "Accept Order", value: "preparing" },
    preparing: { label: "Mark as On The Way", value: "on-the-way" },
    "on-the-way": { label: "Mark as Delivered", value: "delivered" }
  };

  // --- 1. FETCH ORDERS (Real Backend Data) ---
  const fetchOrders = async () => {
    try {
      setLoadingList(true);
      // Assuming you mapped 'getShopOrders' to this endpoint
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/order/shop`, {
        credentials: "include"
      });
      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
      } else {
        console.error("Failed to fetch orders:", result.error);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingList(false);
    }
  };

  async function updateStatus(nextStatus) {
    const res = await fetch(`${import.meta.env.VITE_BASEURL}/order/update`, {
      method: "PUT",
      body: JSON.stringify({
        orderId: selectedOrder._id,
        status: nextStatus
      }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    const data = await res.json();

    if (data.success) {
      fetchOrders(); // refresh list
      closeModal()
    } else {
      console.log(data);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- 2. FETCH DETAILS (Uses your real Backend GET /:id) ---
  const handleOrderClick = async (orderSummary) => {
    setSelectedOrder(orderSummary); // Show summary immediately while loading full data
    setLoadingDetails(true);

    try {
      // Calling your specific endpoint to get single order details
      // Ensure your route is mounted at /client/order/:id
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/order/get/${orderSummary._id}`, {
        credentials: "include"
      });
      const result = await response.json();
      console.log(result);
      if (result.success) {
        setSelectedOrder(result.data); // Replace summary with full populated data
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus === filter;
  });

  return (
    <div className="p-6 pb-24 min-h-screen bg-stone-50 animate-fade-in">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-stone-700">Manage Orders</h2>
        <button
          onClick={fetchOrders}
          className="p-2 text-stone-500 hover:text-amber-600 transition-colors"
          title="Refresh Orders"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'pending', 'preparing', 'on-the-way', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-all ${filter === status
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-stone-500 border border-stone-200'
              }`}
          >
            {status.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="space-y-1">
        {loadingList ? (
          <div className="text-center py-20 text-stone-400">
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard
              key={order._id}
              order={order}
              onClick={handleOrderClick}
            />
          ))
        ) : (
          <div className="text-center py-20 text-stone-400">
            <p>No orders found in this category.</p>
          </div>
        )}
      </div>

      {/* --- ORDER DETAILS MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-fade-in">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-5 border-b border-stone-100 flex justify-between items-center z-10">
              <div>
                <h3 className="font-bold text-lg text-stone-800">Order Details</h3>
                <p className="text-xs text-stone-500">#{selectedOrder._id}</p>
              </div>
              <button onClick={closeModal} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-6">

              {/* Status & Date */}
              <div className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
                <div>
                  <p className="text-xs text-stone-500">Ordered on</p>
                  <p className="font-semibold text-sm text-stone-700">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-500">Status</p>
                  <span className="text-amber-600 font-bold uppercase text-sm">
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-stone-700 mb-3 text-sm uppercase">Items</h4>
                {loadingDetails ? (
                  <div className="text-center py-4 text-stone-400">Loading details...</div>
                ) : (
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-stone-50 pb-2 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                            {/* Mock Image fallback since product might not have image populated in deep nesting */}
                            <img
                              src={item?.productId?.images[0]}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            {/* Check if productId is populated (object) or just an ID (string) */}
                            <p className="font-bold text-stone-700 text-sm">
                              {typeof item.productId === 'object' && item.productId?.productName
                                ? item.productId.productName
                                : "Product Name Loading..."}
                            </p>
                            <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-stone-700">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!loadingDetails && selectedOrder.userId && (
                <div className="border-t border-stone-100 pt-4">
                  <h4 className="font-bold text-stone-700 mb-2 text-sm uppercase">Customer</h4>
                  <div className="text-sm text-stone-600">
                    <p><span className="font-semibold">Name:</span> {selectedOrder.userId.name}</p>
                    <p><span className="font-semibold">Phone:</span> {selectedOrder.userId.phone}</p>
                    <p><span className="font-semibold">Email:</span> {selectedOrder.userId.email}</p>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-2 border-t border-stone-200 mt-4">
                <span className="font-bold text-lg text-stone-800">Total Amount</span>
                <span className="font-extrabold text-2xl text-amber-600">₹{selectedOrder.totalAmount}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">

                {/* Reject Button */}
                {selectedOrder.orderStatus === "pending" && (
                  <button
                    onClick={() => updateStatus("cancelled")}
                    className="
        flex-1 py-3 rounded-xl
        border border-red-200
        text-red-600 font-semibold
        bg-white
        hover:bg-red-50
        transition-all
      "
                  >
                    Reject
                  </button>
                )}

                {/* Primary Action Button */}
                {nextStatusMap[selectedOrder.orderStatus] && (
                  <button
                    onClick={() => {
                      updateStatus(nextStatusMap[selectedOrder.orderStatus].value)
                    }
                    }
                    className="
        flex-1 py-3 rounded-xl
        bg-amber-600 text-white
        font-bold
        shadow-lg shadow-amber-200
        hover:bg-amber-700
        active:scale-[0.98]
        transition-all
      "
                  >
                    {nextStatusMap[selectedOrder.orderStatus].label}
                  </button>
                )}

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;