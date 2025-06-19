'use client';
import React from 'react';

const TrustSection = () => {
  return (
    <section className="w-full mt-24 px-1 md:px-10">
      {/* Heading */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Why Customers Trust Us
        </h2>
        <p className="text-md md:text-xl text-gray-600">
          Our premium fabric, transparent packaging process, and genuine customer experience speak for themselves.
        </p>
      </div>

      {/* Trust Video */}
      <div className="relative  h-[85vh] md:h-[95vh] rounded-sm overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          
          <source src="/videos/Tshirtvideo1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <h3 className="text-white text-3xl md:text-5xl font-semibold px-4 text-center">
            Premium Feel, Pocket-Friendly Deal.
          </h3>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
