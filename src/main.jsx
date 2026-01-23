import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import App from "./App";
import "./index.css";
import ErrorBoundary from "./ErrorBoundary";
import Network from "./pages/Network";
import About from "./pages/About";
import HomePage from "./pages/Homepage";

/* 🔥 Lazy-loaded Pages */
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Settings = lazy(() => import("./pages/Settings"));
const Support = lazy(() => import("./pages/Support"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"))
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
    // ErrorBoundary: <ErrorBoundary />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },

      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "settings", element: <Settings /> },
      { path: "support", element: <Support /> },
      { path: "about", element: <About /> },
      { path: "terms", element: <TermsAndConditions /> },
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

window.onerror = function (message, source, lineno, colno, error) {
  fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      message,
      stack: error?.stack,
      route: window.location.pathname,
      source: "frontend",
      platform: navigator.platform,
      userAgent: navigator.userAgent,
    }),
  });
};

window.onunhandledrejection = function (event) {
  fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: event.reason?.message || "Unhandled Promise rejection",
      stack: event.reason?.stack,
      route: window.location.pathname,
      source: "frontend",
      platform: navigator.platform,
    }),
  });
};
// initNetworkLogger();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
