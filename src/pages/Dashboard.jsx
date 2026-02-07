import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const [orderLength, setOrderLength] = useState(0);
  const [isOnline, setIsOnline] = useState(false); // State for the toggle
  const [loadingStatus, setLoadingStatus] = useState(false);
  const navigate = useNavigate();
console.log(isOnline);
  // 1. Fetch Orders
  const fetchOrderData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/order/length`, {
        credentials: "include"
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrderLength(data.length);
    } catch (error) {
      handleError(error, "/order/length");
    }
  };

  // 2. Fetch Initial Shop Status
  const fetchShopStatus = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/shop/status`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setIsOnline(data.status === true);
      }
    } catch (error) {
      console.error("Failed to load shop status");
    }
  };

  // 3. Toggle Logic
  const toggleShopStatus = async () => {
    setLoadingStatus(true);
    // Optimistic UI update (optional, but feels faster)
    const previousState = isOnline;
    setIsOnline(!previousState);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/shop/toggle-status`, {
        method: "PATCH",
        credentials: "include"
      });

      if (!res.ok) {
        throw new Error("Failed to toggle");
      }
      
      const data = await res.json();
      // Ensure state matches server response
      setIsOnline(data.status === true); 

    } catch (error) {
      // Revert if failed
      setIsOnline(previousState);
      handleError(error, "/shop/toggle-status");
    } finally {
      setLoadingStatus(false);
    }
  };

  // Centralized Error Handler
  const handleError = (error, apiEndpoint) => {
    console.error(error);
    fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        api: apiEndpoint,
        route: window.location.pathname,
        source: "DashboardHome",
        userAgent: navigator.userAgent,
      }),
    });
    // Only redirect to login on specific auth errors if needed
    if(apiEndpoint === "/order/length") navigate("/login");
  };

  useEffect(() => {
    fetchOrderData();
    fetchShopStatus();
  }, []);

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 animate-fade-in gap-8">
      
      {/* --- Toggle Button Section --- */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-stone-100">
          <span className={`text-sm font-bold uppercase tracking-wider ${isOnline ? 'text-green-600' : 'text-stone-400'}`}>
            {isOnline ? "Shop is Online" : "Shop is Offline"}
          </span>
          
          <button
            onClick={toggleShopStatus}
            disabled={loadingStatus}
            className={`
              relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
              ${isOnline ? 'bg-green-500' : 'bg-stone-300'}
            `}
          >
            <span
              className={`
                inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300
                ${isOnline ? 'translate-x-9' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
        <p className="text-xs text-stone-400">
          {isOnline ? "Customers can see your shop." : "Your shop is hidden from customers."}
        </p>
      </div>

      {/* --- Existing Order Counter --- */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
        <div className="relative w-56 h-56 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-stone-50">
          <span className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-1">
            Total Orders
          </span>
          <span className="text-6xl font-extrabold text-stone-800">
            {orderLength}
          </span>
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;