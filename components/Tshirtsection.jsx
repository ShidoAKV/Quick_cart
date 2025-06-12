'use client';
import React from 'react';

const TrustSection = () => {
  return (
    <section className="w-full mt-24 px-4 md:px-10">
      {/* Heading Section */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          Why Customers Trust Us
        </h2>
        <p className="text-md md:text-xl text-gray-600">
          Our premium fabric, transparent packaging process, and genuine customer experience speak for themselves.
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video 1: Build Quality */}
        <div className="relative h-[60vh] rounded-md overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src="/videos/Tshirtvideo1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 z-0" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <h3 className="text-white text-2xl md:text-3xl font-semibold px-4 text-center">
              Premium Build Quality
            </h3>
          </div>
        </div>

        {/* Video 2: New Collection */}
        <div className="relative h-[60vh] rounded-md overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src="/videos/Tshirtvideo1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 z-0" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <h3 className="text-white text-2xl md:text-3xl font-semibold px-4 text-center">
              Explore Our New Collection
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;