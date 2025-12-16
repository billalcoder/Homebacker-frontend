import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App';
import Register from './pages/Register';
import Login from './pages/Login';
import DashboardLayout from './layout/DashboardLayout';
import DashboardHome from './pages/Dashboard';
import UploadProduct from './pages/UploadPage';
import Portfolio from './pages/PortfolioPage';
import UpdateShop from './pages/UploadPage';
import './index.css';
import ShopProfile from './pages/ShopPage';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Order from './pages/Order';
import SubscribePage from './pages/RazorpaySubscriptionPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div className="p-10 text-center">404 - Page Not Found</div>,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "settings", element: <Settings /> },
      { path: "support", element: <Support /> },
      
      // DASHBOARD ROUTES
      {
        path: "dashboard",
        element: <DashboardLayout />, // The Wrapper with Header & BottomNav
        children: [
          { index: true, element: <DashboardHome /> }, // The Circle View
          { path: "upload", element: <UploadProduct /> },
          { path: "portfolio", element: <Portfolio /> },
          { path: "order", element: <Order /> },
          { path: "shop", element: <ShopProfile /> },
          { path: "plan", element: <SubscribePage /> }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);