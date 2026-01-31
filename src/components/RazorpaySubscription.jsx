import React, { useEffect } from "react";

const RazorpaySubscription = ({ subscriptionId, user }) => {

  // 1. Load Razorpay script
  const loadScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 2. Open Razorpay popup
  const openRazorpay = async () => {
    const res = await loadScript();

    if (!res) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    const options = {
      key: 'rzp_live_S8oVAvrnodF632', // Razorpay Key ID
      subscription_id: subscriptionId,           // <-- Subscription ID here
      name: "Home Baker",
      description: "Subscription Payment",
      theme: { color: "#3399cc" },
    };

    const razorpayObj = new window.Razorpay(options);
    razorpayObj.open();
  };

  useEffect(() => {
    if (subscriptionId) {
      openRazorpay();
    }
  }, [subscriptionId]);

  return null; // popup only, no UI
};

export default RazorpaySubscription;
