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
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Razorpay Key ID
      subscription_id: subscriptionId,           // <-- Subscription ID here
      name: "Home Baker",
      description: "Subscription Payment",
      handler: async function (response) {
        console.log("Payment Success:", response);

        // send payment verification to backend
        const verify = await fetch("http://localhost:4000/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const data = await verify.json();
        console.log("Verify Response:", data);
        alert("Subscription Activated!");
      },

      prefill: {
        name: user?.name,
        email: user?.email,
      },

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
