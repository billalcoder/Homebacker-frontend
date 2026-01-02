import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import BottomNav from '../components/BottomNav';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen z-10 bg-stone-50 text-stone-800 flex flex-col font-sans">
      <DashboardHeader />
      
      {/* Main Content Area: The Outlet renders the child route (Home, Upload, etc) */}
      <main className="flex-grow flex flex-col pb-24">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardLayout;