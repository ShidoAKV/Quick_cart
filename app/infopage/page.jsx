// pages/infopage.js
import React from "react";

const infoData = {
  about: `Welcome to Pilley, your premier destination for premium T-shirts in New Delhi.
We offer a thoughtfully curated collection that blends comfort, durability, and on-trend designs for every occasion.
At Pilley, we believe in helping you express your style with confidence through high-quality, stylish T-shirts.`,

  privacy: `Protecting your privacy is a top priority at Pilley. We collect only essential information to process orders and improve your shopping experience.  
Your personal data is securely stored and never sold or shared with third parties without your explicit consent.  
We use encryption and industry-standard security protocols to safeguard your payment details and personal information.  

Additionally, we ensure that all data collected is used strictly for order fulfillment, personalized recommendations, and enhancing your shopping journey.  
Cookies may be used to personalize content and track analytics, but you have full control to disable them in your browser settings.  
We are committed to full transparency, and our users can request, modify, or delete their data at any time by contacting support.  
Our team is regularly trained on privacy practices to ensure your trust and safety remain our top concern.`,

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
    { q: "How long does shipping take?", a: "Standard shipping within Delhi takes 7-10 business days. Express options may be available on request." },
    { q: "Do you ship internationally or to other cities?", a: "Currently, we ship only within Delhi. We're working on expanding to other regions soon." },
    { q: "Are your T-shirts made from organic material?", a: "No, our T-shirts are not made from 100% organic cotton." },
  ],


  shipping: `We currently offer reliable Delivery for all shipments exclusively within Delhi.  
  A flat shipping charge of ₹100 is applicable on all orders, regardless of order value.

  Standard delivery timelines range from 2 to 3 business days.  
  Orders are usually dispatched within 48 hours of order placement, excluding holidays and weekends.  
  For remote Delhi areas or express delivery requests, additional charges may apply.`,

  support: `Our friendly customer support team is here to help!  
Reach us via email at thakurenterprises2115@gmail.com or call +91 9266686822 during business hours
 (Mon-Fri, 9AM - 6PM).  
We are committed to resolving your queries promptly and ensuring your satisfaction with every purchase.`,

  refund: `We offer full order refunds only — partial item-level refunds are not allowed.

To initiate a refund, customers must first pay a non-refundable processing fee of ₹100.  
Refund eligibility is determined based on a strict checklist. Your request will be **considered** only if the following conditions are met:

1. Product label is not removed  
2. Item is not damaged or used  
3. ₹100 Refund Processing Fee has been paid  

If the request satisfies all 3 criteria, the full order amount (excluding the ₹100 fee) will be refunded.  
Refunds are applicable only for complete orders returned within 7-8 days of delivery, in unworn and unwashed condition.  

Once approved, refunds will be processed within 7 business days to your original payment method.  
If the request does not meet the checklist, no refund will be issued, and the processing fee will not be returned.`,

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

        {/* Refund Policy */}
        <section className="bg-black border border-white p-6 rounded-md shadow-md">
          <h2 className="text-3xl font-semibold mb-4">Refund Policy</h2>
          <p className="leading-relaxed whitespace-pre-line">{infoData.refund}</p>
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
