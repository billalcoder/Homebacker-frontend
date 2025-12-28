import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from "./App";
import "./index.css";

/* 🔥 Lazy-loaded Pages */
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Settings = lazy(() => import("./pages/Settings"));
const Support = lazy(() => import("./pages/Support"));

/* 🔥 Dashboard Layout + Pages */
const DashboardLayout = lazy(() => import("./layout/DashboardLayout"));
const DashboardHome = lazy(() => import("./pages/Dashboard"));
const UploadProduct = lazy(() => import("./pages/UploadPage"));
const Portfolio = lazy(() => import("./pages/PortfolioPage"));
const ShopProfile = lazy(() => import("./pages/ShopPage"));
const Order = lazy(() => import("./pages/Order"));
const SubscribePage = lazy(() => import("./pages/RazorpaySubscriptionPage"));

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

      /* 🔥 DASHBOARD ROUTES */
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "upload", element: <UploadProduct /> },
          { path: "portfolio", element: <Portfolio /> },
          { path: "order", element: <Order /> },
          { path: "shop", element: <ShopProfile /> },
          { path: "plan", element: <SubscribePage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);
