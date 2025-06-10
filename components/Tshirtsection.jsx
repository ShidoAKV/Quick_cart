'use client'
import React from 'react';

const TshirtHeroSection = () => {

  return (
    <section className="relative bg-black overflow-hidden h-[90vh] w-full flex items-center rounded-sm justify-center mt-50">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src='/videos/tshirtvideo.mp4' type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="relative z-10 text-center text-white px-4 md:px-16">
        <h1 className="text-3xl md:text-6xl font-bold mb-4">Style Meets Comfort</h1>
        <p className="text-md md:text-xl max-w-2xl mx-auto mb-6">
          Explore our latest collection 
        </p>
        <a
          href="/products/tshirts"
          className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition"
        >
          Shop Now
        </a>
      </div>

      {/* Optional Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-30 z-0" />
    </section>
  );
};

export default TshirtHeroSection;
