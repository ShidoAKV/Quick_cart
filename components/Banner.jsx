import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const Banner = () => {
  const {router}=useAppContext();
  return (
    <div className="flex flex-row flex-wrap items-center justify-center md:justify-between bg-[#f2f4f8] rounded-3xl overflow-hidden shadow-md my-16 px-6 md:px-20 py-10 gap-6">
      <Image
        className="w-44 md:w-60 rounded-lg object-cover"
        src={assets.lefttshit}
        alt="Model with T-shirt"
      />
      <div className="flex-1 min-w-[250px] flex flex-col justify-center items-start text-left space-y-4 px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          Elevate Your Everyday Look
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-md">
          Discover our latest collection of oversized, patterned, and plain T-shirts designed for comfort and style.
        </p>
        <button 
         onClick={()=>router.push('/all-products')}
         className="cursor-pointer group flex items-center gap-2 px-6 py-2 sm:px-8 sm:py-3 bg-black/80 hover:bg-black rounded text-white transition">
          Shop Now
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Right Image (only shown on md and above) */}
      <img
        className="hidden md:block w-64 rounded-lg object-cover"
        src="https://png.pngtree.com/png-clipart/20230928/original/pngtree-white-men-s-classic-t-shirt-front-and-back-png-image_13164468.png"
        alt="T-shirt Display"
      />
    </div>
  );
};

export default Banner;
