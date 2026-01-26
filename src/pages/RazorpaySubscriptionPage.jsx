import React, { useState } from "react";
import { Check, Star, Shield, Zap } from "lucide-react";
import RazorpaySubscription from "../components/RazorpaySubscription"; // Ensure this path is correct

export default function SubscribePage() {
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const createSubscription = async () => {
    try {
      setLoading(true);
      // Using port 4000 as per your snippet
      const res = await fetch(`${import.meta.env.VITE_BASEURL}/payment/create-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // Include credentials if your backend requires auth cookie/token
        credentials: "include"
      });

      const data = await res.json();

      if (data.subscription_id) {
        setSubscriptionId(data.subscription_id);
      } else {
        alert("Failed to initiate subscription. Check backend.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      fetch(`${import.meta.env.VITE_BASEURL}/log/frontend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          api: "/payment/create-subscription",
          route: window.location.pathname,
          source: "payment",
          userAgent: navigator.userAgent,
        }),
      });
      alert("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 font-sans">

      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-stone-800 mb-2">Upgrade Your Bakery</h1>
        <p className="text-stone-500 text-lg">Unlock premium features to scale your business.</p>
      </div>

      {/* Pricing Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden w-full max-w-md relative hover:shadow-2xl transition-shadow duration-300">

        {/* Popular Badge */}
        <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1 absolute top-0 right-0 rounded-bl-xl">
          MOST POPULAR
        </div>

        <div className="p-8">
          {/* Plan Title */}
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <Star size={20} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800">Baker Plan</h2>
          </div>

          {/* Price */}
          <div className="flex items-end gap-1 mb-6">
            <span className="text-5xl font-extrabold text-stone-800">₹399</span>
            <span className="text-stone-400 font-medium mb-1">/ month</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-100 w-full mb-6"></div>

          {/* Features List */}
          <ul className="space-y-4 mb-8">
            {[
              "Unlimited Product Uploads",
              "Order Management",
              "Priority Customer Support",
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-stone-600">
                <div className="mt-0.5 bg-green-100 p-0.5 rounded-full">
                  <Check size={14} className="text-green-600" strokeWidth={3} />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Action Button */}
          <button
            onClick={createSubscription}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-amber-200 hover:from-amber-700 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap size={20} fill="currentColor" />
                Start Subscription
              </>
            )}
          </button>

          <p className="text-xs text-stone-400 text-center mt-4">
            Secure payment via Razorpay. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 flex gap-6 text-stone-400 text-sm font-medium">
        <span className="flex items-center gap-1"><Shield size={16} /> Secure Payment</span>
        <span className="flex items-center gap-1"><Star size={16} /> 4.9/5 Rating</span>
      </div>

      {/* Razorpay Component (Hidden logic, triggers popup) */}
      {subscriptionId && (
        <RazorpaySubscription
          subscriptionId={subscriptionId}
          // You can fetch real user data from context or props here
          user={{ name: "Chef John", email: "john@bakery.com" }}
        />
      )}
    </div>
  );
}