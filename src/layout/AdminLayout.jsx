import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Users, Store, Package, LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check Admin Status on Mount
  useEffect(() => {
    // Optional: Call /admin/me to verify session before rendering
    // For now, we assume if the API fails with 401/403, the specific pages will handle it
    // or we can do a quick check here.
    setLoading(false); 
    setIsAuthorized(true); // Optimistic for UI demo
  }, []);

  const handleLogout = () => {
    // Add your logout logic here (clear cookies, etc)
    navigate('/login');
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-stone-100 font-sans flex text-stone-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col fixed h-full inset-y-0 left-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-stone-800 bg-stone-950">
          <ShieldCheck className="text-amber-500 mr-2" />
          <span className="font-bold text-white text-lg tracking-wide">AdminPortal</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem to="/admin/users" icon={<Users size={20} />} label="Manage Users" />
          <NavItem to="/admin/clients" icon={<Store size={20} />} label="Manage Clients" />
          <NavItem to="/admin/products" icon={<Package size={20} />} label="Manage Products" />
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-stone-800 rounded-xl transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' 
          : 'hover:bg-stone-800 hover:text-white'
      }`
    }
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </NavLink>
);

export default AdminLayout;