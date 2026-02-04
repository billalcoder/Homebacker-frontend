import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  async function eventhandeler() {
    const res = await fetch(`${import.meta.env.VITE_BASEURL}/client/logout`, {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      alert("logout done")
    }
    const data = await res.json()
  }
  return (
    <header className="px-6 py-5 flex justify-between items-center bg-white shadow-sm sticky top-0 z-40">
      <div>
        <Link to="/dashboard" className="text-xl font-bold text-amber-700">Baker's Dashboard</Link>
        <p className="text-xs text-stone-500">Welcome back, Chef</p>
      </div>

      {/* Profile Avatar */}
      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-10 h-10 rounded-full bg-stone-200 border-2 border-amber-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-300 transition-transform hover:scale-105"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Baker"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <div className="absolute z-50 right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-2 z-50 z-auto animate-fade-in-down">
            <div className="px-4 py-2 border-b border-stone-100 mb-1">
              <p className="text-sm font-bold text-stone-700">My Account</p>
            </div>
            <Link to={"/settings"} className="w-full text-left px-4 py-2 text-stone-600 hover:bg-amber-50 hover:text-amber-700 text-sm">
              ⚙️ Settings
            </Link>
            <button className="w-full text-left px-4 py-2 text-stone-600 hover:bg-amber-50 hover:text-amber-700 text-sm">
              <Link to={"/support"}> 🎧 Support </Link>
            </button>
            <div className="border-t border-stone-100 mt-1">
              <Link to="/login" onClick={eventhandeler} className="block px-4 py-2 text-red-500 hover:bg-red-50 text-sm">
                Logout
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;