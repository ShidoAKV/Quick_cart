// pages/infopage.js
import React from "react";

const infoData = {
  about: `Welcome to Pilley, your premier destination for premium T-shirts in New Delhi.
We offer a thoughtfully curated collection that blends comfort, durability, and on-trend designs for every occasion.
At Pilley, we believe in helping you express your style with confidence through high-quality, stylish T-shirts.`,
  
  privacy: `Protecting your privacy is a top priority at Pilley. We collect only essential information to process orders and improve your shopping experience.  
  Your personal data is securely stored and never sold or shared with third parties without your explicit consent.  
  We use encryption and industry-standard security protocols to safeguard your payment details and personal information.  
  `,
   collections: [
    {
      name: "Oversized T-shirt",
      description: "Comfortable, loose-fitting oversized T-shirts perfect for a relaxed and trendy look.",
    },
    {
      name: "Plain T-shirt",
      description: "Classic plain T-shirts crafted with organic cotton for everyday style and comfort.",
    },
    {
      name: "Pattern T-shirt",
      description: "Unique pattern designs that add personality and flair to your wardrobe.",
    },
  ],


  faqs: [
    { q: "What is your return policy?", a: "You can return any unworn and unwashed products within 5 days of purchase for a full refund or exchange." },
    { q: "How long does shipping take?", a: "Standard shipping within India takes 5-7 business days. Express options are available at checkout." },
    { q: "Do you ship internationally?", a: "Currently, we ship only within India but are working on expanding globally soon." },
    { q: "Are your T-shirts made from organic material?", a: "No  our T-shirts are  not made from 100%  organic cotton." },
    
  ],

  shipping: `We offer reliable and eco-friendly packaging with all shipments.  
  Orders above ₹1500 qualify for free standard shipping within New Delhi and nearby areas.  
  For remote locations and express delivery, additional charges may apply.`,

  support: `Our friendly customer support team is here to help!  
  Reach us via email at support@pilley.in or call +91 9266686822 during business hours (Mon-Fri, 9AM - 6PM).  
  We are committed to resolving your queries promptly and ensuring your satisfaction with every purchase.`,
};

const Infopage = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Information</h1>

        {/* About Us */}
        <section className="bg-black border border-white p-6 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-4">About Us</h2>
          <p className="leading-relaxed whitespace-pre-line">{infoData.about}</p>
        </section>

        {/* Privacy Policy */}
        <section className="bg-black border border-white p-6 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-4">Privacy Policy</h2>
          <p className="leading-relaxed whitespace-pre-line">{infoData.privacy}</p>
        </section>

        {/* FAQs */}
        <section className="bg-black border border-white p-6 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-4">Frequently Asked Questions</h2>
          <ul className="space-y-6">
            {infoData.faqs.map(({ q, a }, idx) => (
              <li key={idx} className="border-b border-white pb-4">
                <p className="font-semibold">{q}</p>
                <p className="leading-relaxed">{a}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Collections */}
        <section className="bg-black border border-white p-6 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-4">Our Collections</h2>
          <ul className="space-y-8">
            {infoData.collections.map(({ name, description }, idx) => (
              <li key={idx} className="border-b border-white pb-6">
                <h3 className="font-semibold text-xl">{name}</h3>
                <p className="leading-relaxed">{description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Shipping Info */}
        <section className="bg-black border border-white p-6 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-4">Shipping Information</h2>
          <p className="leading-relaxed whitespace-pre-line">{infoData.shipping}</p>
        </section>

        {/* Customer Support */}
        <section className="bg-black border border-white p-6 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-4">Customer Support</h2>
          <p className="leading-relaxed whitespace-pre-line">{infoData.support}</p>
        </section>
      </div>
    </div>
  );
};

export default Infopage;
