import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  // Helper for consistent classes
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${isActive ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'
    }`;

  const iconBaseClass = ({ isActive }) =>
    `p-1 rounded-lg ${isActive ? 'bg-amber-50' : ''}`;

  return (
    <nav className="fixed bottom-0 z-10 w-full bg-white border-t border-stone-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-around items-center h-20 px-2">

        {/* 1. Home (Dashboard Main) */}
        <NavLink to="/dashboard" end className={linkClass}>
          {({ isActive }) => (
            <>
              <div className={iconBaseClass({ isActive })}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold">Home</span>
            </>
          )}
        </NavLink>

        {/* 2. Upload Product */}
        <NavLink to="/dashboard/upload" className={linkClass}>
          {({ isActive }) => (
            <>
              <div className={iconBaseClass({ isActive })}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold">Upload</span>
            </>
          )}
        </NavLink>
        <NavLink to="/network" className={linkClass}>
          {({ isActive }) => (
            <>
              <div className={iconBaseClass({ isActive })}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold">network</span>
            </>
          )}
        </NavLink>
        <NavLink to="/dashboard/order" className={linkClass}>
          {({ isActive }) => (
            <>
              <div className={iconBaseClass({ isActive })}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 104 0H9zM9 12h6M9 16h6" />
                </svg>

              </div>
              <span className="text-[10px] font-semibold">Orders</span>
            </>
          )}
        </NavLink>

        {/* 4. Update Shop */}
        <NavLink to="/dashboard/shop" className={linkClass}>
          {({ isActive }) => (
            <>
              <div className={iconBaseClass({ isActive })}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold">Shop</span>
            </>
          )}
        </NavLink>

      </div>
    </nav>
  );
};

export default BottomNav;