import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const Support = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });

  const faqs = [
    {
      q: "How do I upload a new product?",
      a: "Go to the Dashboard and click 'Upload Product' in the bottom navigation bar. Fill in the details and add an image."
    },
    {
      q: "Can I change my shop name?",
      a: "Yes, navigate to the 'Update Shop' tab in the bottom menu to modify your shop details."
    },
    {
      q: "How do I process a refund?",
      a: "Currently, refunds must be processed manually. Please contact support if you need assistance with a transaction."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We will get back to you shortly.");
    setContactForm({ subject: '', message: '' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24 animate-fade-in">
      <h2 className="text-2xl font-bold text-stone-700 mb-2">Help & Support</h2>
      <p className="text-stone-500 mb-8">We are here to help your bakery succeed.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column: FAQ Accordion */}
        <div>
          <h3 className="font-bold text-amber-700 text-lg mb-4">Frequently Asked Questions</h3>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-stone-100 last:border-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center focus:outline-none hover:bg-stone-50"
                >
                  <span className="font-semibold text-stone-700 text-sm">{faq.q}</span>
                  <span className={`text-amber-500 transform transition-transform ${activeFaq === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-4 text-sm text-stone-500 bg-stone-50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Info Box */}
          <div className="mt-6 bg-amber-50 p-5 rounded-xl border border-amber-100">
            <h4 className="font-bold text-amber-800 mb-2">Need direct help?</h4>

            <div className="text-sm text-stone-600 space-y-1">

              {/* Email */}
              <a
                href="mailto:billalshekhani10@gmail.com"
                className="block hover:text-amber-700 transition-colors"
              >
                ✉️ billalshekhani10@gmail.com
              </a>

            </div>
          </div>

        </div>

        {/* Right Column: Contact Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 h-fit">
          <h3 className="font-bold text-amber-700 text-lg mb-4">Send us a Message</h3>
          <form onSubmit={handleContactSubmit}>
            <FormInput
              label="Subject"
              name="subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              placeholder="e.g. Issue with uploading image"
            />

            <div className="mb-4 w-full">
              <label className="block text-stone-600 text-sm font-semibold mb-2">Message</label>
              <textarea
                rows="5"
                className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Describe your issue..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
              ></textarea>
            </div>

            <Button text="Send Message" type="submit" disabled={true} />
            <label className="block text-stone-600 text-sm font-semibold mb-2 mt-3 ">This feature will come soon you can direct connect with me or by my Number</label>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Support;