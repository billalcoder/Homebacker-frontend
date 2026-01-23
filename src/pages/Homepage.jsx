import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-800 font-sans">

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          BakerLane.shop
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          A simple platform built exclusively for home bakers to showcase
          their products and receive direct customer orders — without commission.
        </p>

        <div className="flex justify-center gap-4">
          {/* REGISTER LINK */}
          <Link
            to="/register"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition"
          >
            Get Started as a Home Baker
          </Link>

          {/* LOGIN LINK */}
          <Link
            to="/login"
            className="border border-amber-600 text-amber-600 px-6 py-3 rounded-lg font-medium hover:bg-amber-50 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* WHY BAKERLANE */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Why BakerLane.shop?
        </h2>

        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="font-semibold mb-2">🚫 No Commission</h3>
            <p className="text-sm text-gray-600">
              Home bakers keep 100% of their earnings. No hidden fees.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">📦 Simple Orders</h3>
            <p className="text-sm text-gray-600">
              Manage products and customer orders in one place.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">🏠 Built for Home Bakers</h3>
            <p className="text-sm text-gray-600">
              Designed specifically for home-based baking businesses.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER LINKS */}
      <footer className="border-t py-6 text-center text-sm text-gray-500">
        <Link to="/about" className="mx-2 hover:underline">About</Link>
        <Link to="/support" className="mx-2 hover:underline">Support</Link>
        <Link to="/terms" className="mx-2 hover:underline">Terms</Link>
      </footer>

    </main>
  );
};

export default HomePage;
