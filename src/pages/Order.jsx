import React, { useState, useEffect } from 'react';
import OrderCard from '../components/Order';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  // --- NEW STATE FOR PRICE EDITING ---
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  // -----------------------------------

  const customization = selectedOrder?.customization

  const nextStatusMap = {
    pending: { label: "Accept Order", value: "preparing" },
    preparing: { label: "Mark as On The Way", value: "on-the-way" },
    "on-the-way": { label: "Mark as Delivered", value: "delivered" }
  };

  const fetchOrders = async () => {
    try {
      setLoadingList(true);
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
      // ... error logging code ...
    } finally {
      setLoadingList(false);
    }
  };

  async function updateStatus(nextStatus) {
    // ... existing updateStatus code ...
    try {
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
        fetchOrders();
        closeModal();
      }
    } catch (error) {
      alert("server error");
    }
  }

  // --- NEW FUNCTION: UPDATE PRICE ---
  // Note: You must ensure your backend has a route like /order/update-price
  async function handleUpdatePrice() {
    if (!priceInput || isNaN(priceInput) || Number(priceInput) < 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/order/update-price`, {
        method: "PUT",
        body: JSON.stringify({
          orderId: selectedOrder._id,
          totalAmount: Number(priceInput)
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        // Update local state immediately so UI reflects change
        setSelectedOrder(prev => ({ ...prev, totalAmount: Number(priceInput) }));
        fetchOrders(); // Update background list
        setIsEditingPrice(false); // Exit edit mode
      } else {
        alert("Failed to update price");
      }
    } catch (error) {
      console.error(error);
      alert("Server error updating price");
    }
  }
  // ----------------------------------

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderClick = async (orderSummary) => {
    setSelectedOrder(orderSummary);

    // Reset editing state when opening new order
    setIsEditingPrice(false);
    setPriceInput(orderSummary.totalAmount || 0);

    setLoadingDetails(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASEURL}/order/get/${orderSummary._id}`, {
        credentials: "include"
      });
      const result = await response.json();
      if (result.success) {
        setSelectedOrder(result.data);
        // Update input with fresh data
        setPriceInput(result.data.totalAmount);
      }
    } catch (error) {
      // ... logging ...
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsEditingPrice(false); // Reset on close
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.orderStatus === filter;
  });

  return (
    <div className="p-6 z-50 pb-24 min-h-screen bg-stone-50 animate-fade-in">
      {/* ... Header and Filter Tabs code remain same ... */}

      {/* ... Order List code remains same ... */}

      {/* Order List Rendering (Collapsed for brevity) */}
      <div className="space-y-1">
        {loadingList ? (
          <div className="text-center py-20 text-stone-400"><p>Loading orders...</p></div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard key={order._id} order={order} onClick={handleOrderClick} />
          ))
        ) : (
          <div className="text-center py-20 text-stone-400"><p>No orders found.</p></div>
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
              <button onClick={closeModal} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">✕</button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-6">

              {/* ... Status, Items List, Customer Details code remain same ... */}

              {/* (Existing Code Placeholder for Items/Customer info...) */}
              <div className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
                {/* ... Date and Status ... */}
                <div>
                  <p className="text-xs text-stone-500">Ordered on</p>
                  <p className="font-semibold text-sm text-stone-700">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-amber-600 font-bold uppercase text-sm">{selectedOrder.orderStatus}</span>
                </div>
              </div>

              {/* Items List (Simplified for view) */}
              <div>
                <h4 className="font-bold text-stone-700 mb-3 text-sm uppercase">Items</h4>
                {/* ... (Your existing item mapping code) ... */}
                {loadingDetails ? (
                  <div className="text-center py-4 text-stone-400">Loading details...</div>
                ) : (
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center border-b border-stone-50 pb-2 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item?.productId?.images?.[0]}
                                alt="Product"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-stone-700 text-sm">
                                {typeof item.productId === "object" && item.productId?.productName
                                  ? item.productId.productName
                                  : "Product Name Loading..."}
                              </p>
                              <p className="text-xs text-stone-500">
                                Qty : {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-stone-700">₹{item.price}</p>
                        </div>
                      ))
                    ) : (
                      // 👇 Fallback to customization when items are empty
                      <div className="flex justify-between items-center border-b border-stone-50 pb-2">
                        <div>
                          <p className="font-bold text-stone-700 text-sm">Custom Order</p>
                          <p className="text-xs text-stone-500">Flavor: {selectedOrder.customization?.flavor}</p>
                          <p className="text-xs text-stone-500">Weight: {selectedOrder.customization?.weight}</p>
                          <p className="text-xs text-stone-500">Theme: {selectedOrder.customization?.theme}</p>
                        </div>
                        <p className="font-semibold text-stone-700 text-sm text-right max-w-[120px]">
                          {selectedOrder.totalAmount > 0
                            ? "₹" + selectedOrder.totalAmount
                            : "Price: Discuss on call"}
                        </p>
                      </div>
                    )}

                  </div>
                )}
                {/* I'm keeping your fallback logic intact */}

              </div>

              {/* Customer Details */}
              {!loadingDetails && selectedOrder.userId && (
                <div className="border-t border-stone-100 pt-4">
                  <h4 className="font-bold text-stone-700 mb-2 text-sm uppercase">Customer</h4>
                  <div className="text-sm text-stone-600">
                    <p><span className="font-semibold">Name:</span> {selectedOrder.userId.name}</p>
                    {/* <p><span className="font-semibold">Phone:</span> {selectedOrder.userId.phone}</p> */}
                    <p><span className="font-semibold">Email:</span> {selectedOrder.userId.email}</p>
                    <br />
                    <p><span className="font-semibold">Area:</span> {selectedOrder.userId.address.area}</p>
                    <p><span className="font-semibold">Building Name:</span> {selectedOrder.userId.address.buildingName}</p>
                    <p><span className="font-semibold">flatNo:</span> {selectedOrder.userId.address.flatNo}</p>
                    <p><span className="font-semibold">City:</span> {selectedOrder.userId.address.city}</p>
                    <p><span className="font-semibold">State:</span> {selectedOrder.userId.address.state}</p>

                  </div>
                </div>
              )}

              {/* --- TOTAL AMOUNT SECTION --- */}
              <div className="flex justify-between items-center pt-2 border-t border-stone-200 mt-4">
                <span className="font-bold text-lg text-stone-800">Total Amount</span>
                <span className="font-extrabold text-2xl text-amber-600">₹{selectedOrder.totalAmount}</span>
              </div>

              {/* --- NEW EDIT PRICE SECTION --- */}
              {selectedOrder.items && selectedOrder.items.length === 0 && (
                <div className="flex flex-col items-end gap-2">
                  {!isEditingPrice ? (
                    <button
                      onClick={() => setIsEditingPrice(true)}
                      className="text-xs font-semibold text-stone-500 underline hover:text-amber-600 transition-colors"
                    >
                      Edit Price
                    </button>
                  ) : (
                    <div className="w-full bg-stone-50 p-3 rounded-xl border border-stone-200 animate-fade-in">
                      <label className="text-xs font-bold text-stone-500 uppercase">Update Total Amount</label>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="number"
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value)}
                          className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:border-amber-500"
                          placeholder="Enter new amount"
                        />
                        <button
                          onClick={handleUpdatePrice}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingPrice(false);
                            setPriceInput(selectedOrder.totalAmount); // Revert value
                          }}
                          className="bg-stone-200 text-stone-600 px-3 py-2 rounded-lg font-bold text-sm hover:bg-stone-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* ----------------------------- */}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {/* ... Reject / Next Status Buttons ... */}
                {selectedOrder.orderStatus === "pending" && (
                  <button onClick={() => updateStatus("cancelled")} className="flex-1 py-3 rounded-xl border border-red-200 text-red-600 font-semibold bg-white hover:bg-red-50">Reject</button>
                )}
                {nextStatusMap[selectedOrder.orderStatus] && (
                  <button onClick={() => updateStatus(nextStatusMap[selectedOrder.orderStatus].value)} className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-bold shadow-lg shadow-amber-200 hover:bg-amber-700">
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