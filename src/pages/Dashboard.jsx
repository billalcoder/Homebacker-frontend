import React from 'react';

const DashboardHome = () => {

  console.log(import.meta.env.VITE_BASEURL);
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
        <div className="relative w-56 h-56 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-stone-50">
          <span className="text-stone-400 text-sm font-medium uppercase tracking-wider mb-1">Total Orders</span>
          <span className="text-6xl font-extrabold text-stone-800">128</span>
          <span className="text-green-500 text-xs font-bold mt-2 bg-green-50 px-2 py-1 rounded-full">
            ▲ 12% this week
          </span>
        </div>
      </div>
      <p className="mt-8 text-stone-500 text-center max-w-xs">
        Your shop is performing well today!
      </p>
    </div>
  );
};

export default DashboardHome;