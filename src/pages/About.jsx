import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        About BakerLane.shop
      </h1>

      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
        BakerLane.shop is built with a focus on trust, transparency, and
        simplicity — helping home bakers receive direct customer orders.
      </p>

      {/* 🔗 Section Navbar */}
      <nav className="sticky top-0 z-10 bg-white border-b border-stone-200 mb-10">
        <ul className="flex flex-wrap justify-center gap-4 py-3 text-sm font-medium text-amber-600">
          <li><a href="#what" className="hover:underline">What</a></li>
          <li><a href="#why" className="hover:underline">Why</a></li>
          <li><a href="#who" className="hover:underline">Who</a></li>
          <li><a href="#trust" className="hover:underline">Trust</a></li>
          <li><a href="#free" className="hover:underline">Pricing</a></li>
          <li><a href="#faq" className="hover:underline">FAQ</a></li>
        </ul>
      </nav>

      {/* What */}
      <section id="what" className="mb-10 scroll-mt-24">
        <h2 className="text-xl font-semibold mb-2">🍞 What is BakerLane.shop?</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>BakerLane.shop</strong> is an online platform created
          exclusively for home bakers. It helps home bakers showcase their baked
          products, connect with nearby customers, and receive direct orders —
          without needing a physical shop.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          From cakes and cupcakes to cookies and custom bakes, BakerLane.shop
          helps home bakers grow online with confidence.
        </p>
      </section>

      {/* Why */}
      <section id="why" className="mb-10 scroll-mt-24">
        <h2 className="text-xl font-semibold mb-2">🎯 Why BakerLane.shop Exists</h2>
        <p className="text-gray-700 leading-relaxed">
          Many talented home bakers depend only on WhatsApp or social media,
          making order management and trust-building difficult.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          BakerLane.shop provides a structured, transparent platform so bakers
          can focus on baking while customers enjoy a reliable ordering
          experience.
        </p>
      </section>

      {/* Who */}
      <section id="who" className="mb-10 scroll-mt-24">
        <h2 className="text-xl font-semibold mb-2">👩‍🍳 Who Is It For?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Home-based cake makers</li>
          <li>Custom order bakers</li>
          <li>Part-time & full-time home bakers</li>
          <li>New baking entrepreneurs</li>
        </ul>
      </section>

      {/* Trust */}
      <section id="trust" className="mb-10 scroll-mt-24">
        <h2 className="text-xl font-semibold mb-2">🔒 Built on Trust</h2>
        <p className="text-gray-700 leading-relaxed">
          BakerLane.shop values transparency and security. Home bakers stay in
          full control of their pricing, products, and customer interactions.
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          We do not interfere with orders or customer relationships — our role
          is to provide a safe and reliable platform.
        </p>
      </section>

      {/* Free */}
      <section id="free" className="mb-10 scroll-mt-24">
        <h2 className="text-xl font-semibold mb-2">💸 Is BakerLane.shop Free?</h2>
        <p className="text-gray-700 leading-relaxed">
          Yes ✅ <strong>Joining BakerLane.shop is currently free.</strong>
        </p>
        <p className="text-gray-700 leading-relaxed mt-2">
          Home bakers can create profiles, list products, and receive orders
          without any registration fee.
        </p>
      </section>


      {/* FAQ */}
      {/* FAQ */}
      <section id="faq" className="mb-12 scroll-mt-24">
        <p className="text-sm text-gray-600 mb-6">
          BakerLane.shop is built to support home bakers — not to take a share of their
          earnings. There are no commissions, no lock-ins, and no hidden charges.
        </p>
        <h2 className="text-xl font-semibold mb-4">
          ❓ Frequently Asked Questions
        </h2>

        <div className="space-y-5 text-gray-700">

          <div>
            <h4 className="font-semibold">
              Is BakerLane.shop commission-based?
            </h4>
            <p className="text-sm mt-1">
              No. BakerLane.shop is not commission-based at all. Home bakers keep
              100% of their earnings. We do not take any percentage from your orders,
              now or in the future.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Is BakerLane.shop only for home bakers?
            </h4>
            <p className="text-sm mt-1">
              Yes. BakerLane.shop is designed exclusively for home bakers and
              home-based baking businesses.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Do I need a physical shop or bakery license?
            </h4>
            <p className="text-sm mt-1">
              No physical shop is required. Licensing requirements may vary by
              location, and home bakers are responsible for following local food
              regulations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              How do customers contact me?
            </h4>
            <p className="text-sm mt-1">
              one's you accept the order of Customer. then they will get the your number and they can connent with you.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Does BakerLane.shop handle payments?
            </h4>
            <p className="text-sm mt-1">
              Payments are handled directly between the home baker and the customer.
              BakerLane.shop does not control or delay your payments.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Can I set my own prices?
            </h4>
            <p className="text-sm mt-1">
              Yes. Home bakers have full control over their pricing, products, and
              availability.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Will BakerLane.shop promote my products?
            </h4>
            <p className="text-sm mt-1">
              BakerLane.shop helps customers discover home bakers, but sales depend on
              product quality, pricing, and availability.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Is my data and profile information safe?
            </h4>
            <p className="text-sm mt-1">
              Yes. We follow secure practices to protect user data and do not sell or
              misuse personal information.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Can I leave BakerLane.shop anytime?
            </h4>
            <p className="text-sm mt-1">
              Yes. There is no lock-in. You can stop using the platform at any time.
            </p>
          </div>

        </div>
      </section>


      {/* CTA */}
      <div className="text-center bg-stone-50 border border-stone-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-2">
          Ready to receive customer orders?
        </h3>
        <p className="text-gray-600 mb-4">
          Create your free account and start your home baking journey.
        </p>
        <Link
          to="/register"
          className="inline-block bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition"
        >
          Create Free Account
        </Link>
      </div>
      {/* Support */}
      <section id="support" className="mb-12 scroll-mt-24">
        <h2 className="text-xl font-semibold mb-2">🛠 Support</h2>
        <p className="text-gray-700 leading-relaxed mb-2">
          For any assistance or questions, you can reach our support team anytime.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Visit our <Link to="/support" className="text-amber-600 hover:underline">Support Page</Link> for FAQs, contact forms, and more.
        </p>
      </section>

      {/* Terms */}
      <section id="terms" className="mb-12 scroll-mt-24">
        <h2 className="text-xl font-semibold mb-2">📄 Terms & Conditions</h2>
        <p className="text-gray-700 leading-relaxed mb-2">
          By using BakerLane.shop, you agree to our Terms & Conditions.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Read the full terms on our <Link to="/terms" className="text-amber-600 hover:underline">Terms & Conditions Page</Link>.
        </p>
      </section>

    </div>
  );
};

export default About;
