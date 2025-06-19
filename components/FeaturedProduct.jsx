'use client'

import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";


const products = [
  {
    id: 1,
    image: assets.plain,
    title: "Oversized T-shirt",
    type:"OVERSIZED",
    tagline: "Ultimate Comfort",
    description: "Comfortable streetwear-style tees for everyday style.",
  },
  {
    id: 2,
    image: assets.printed,
    title: "Pattern T-shirt",
    type:"PATTERN",
    tagline: "Bold Designs",
    description: "Trendy prints and bold patterns to stand out in a crowd.",
  },
  {
    id: 3,
    image: assets.oversized,
    title: "Plain T-shirt",
    type:"PLAIN",
    tagline: "Clean & Classic",
    description: "Minimalist essentials, crafted with premium cotton.",
  },
];


const FeaturedProduct = () => {
   const {router}=useAppContext();

  return (
    <div className="mt-20">
      {/* Header */}
      <div className="flex flex-col items-center">
        <p className="text-3xl font-bold text-black">Featured Products</p>
        <div className="w-24 h-1 bg-green-800 mt-2 rounded-full"></div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14 px-1 md:px-12">
        {products?.map(({ id, image, title,type, tagline, description }) => (
          <div
            key={id}
            className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-md group hover:shadow-lg transition duration-300"
          >
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                src={image}
                alt={title}
                className="object-cover  w-[500px] h-[500px] bg-[#f2f4f8] group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 bg-black text-white  text-xs px-2 py-0.5 rounded-full uppercase tracking-wider">
                {tagline}
              </div>
            </div>

            <div className="p-5 space-y-2">
              <h3 className="text-xl font-semibold text-black">{title}</h3>
              <p className="text-gray-700 text-sm">{description}</p>
              <button className="mt-3 inline-flex items-center gap-2 cursor-pointer bg-gray-900 hover:bg-black text-white text-sm px-4 py-2 rounded-sm transition"
               onClick={()=>router.push(`/all-products?type=${type}`)}
              >
                Buy Now
                <Image
                  className="w-4 h-4"
                  src={assets.redirect_icon}
                  alt="arrow"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
