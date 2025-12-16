import React, { useEffect, useState } from 'react';

const DashboardHome = () => {
  const [orderLength, setOrderLength] = useState(0)

  async function Setorder() {
    const res = await fetch(`${import.meta.env.VITE_BASEURL}/order/shop`, { credentials: "include" })
    const data = await res.json()
    console.log(data.length);
    setOrderLength(data.length)
  }
  useEffect(() => {
    Setorder()
  }, [])
  console.log(orderLength);
  console.log(import.meta.env.VITE_BASEURL);
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
        <div className="relative w-56 h-56 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-stone-50">
          <span className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-1">Total Orders</span>
          <span className="text-6xl font-extrabold text-stone-800">{orderLength}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;