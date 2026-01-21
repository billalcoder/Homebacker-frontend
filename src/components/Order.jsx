import React from 'react';

const OrderCard = ({ order, onClick }) => {
  // Helper to choose badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  return (
    <div 
      onClick={() => onClick(order)}
      className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 mb-3 cursor-pointer hover:shadow-md transition-all active:scale-95"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-stone-800">Order #{order._id.slice(-6).toUpperCase()}</h4>
          <p className="text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus}
        </span>
      </div>
      
      <div className="flex justify-between items-end mt-3">
        <div>
          <p className="text-sm text-stone-600">{order.items.length === 0 ? "Customize product" : `Item : ${order.items.length}`}</p>
          <p className="text-xs text-stone-400">Tap to view details</p>
        </div>
        <p className="text-lg font-bold text-amber-600">₹{order.totalAmount}</p>
      </div>
    </div>
  );
};

export default OrderCard;