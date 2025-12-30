import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const [orderLength, setOrderLength] = useState(0);
  const navigate = useNavigate();

  const setOrder = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASEURL}/order/length`,
        {
          credentials: "include"
        }
      );

      // 🔐 Session expired / not logged in
      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      setOrderLength(data.length);

    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    setOrder();
  }, []);

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 animate-fade-in">
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
