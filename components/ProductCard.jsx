import React, { useState } from 'react';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();



  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => {
        router.push('/product/' + product.id);
        scrollTo(0, 0);
      }}
      className="flex flex-col gap-2 bg-[#f2f4f8] hover:bg-gray-200 rounded-xl p-3 shadow hover:shadow-md transition cursor-pointer w-full max-w-[220px]"
    >
      <div className="relative w-full h-52 rounded-lg overflow-hidden flex items-center justify-center bg-white">
        <Image
          src={product?.image[0]}
          alt={product?.name}
          className="object-cover w-4/5 h-4/5 group-hover:scale-105 transition duration-300"
          width={800}
          height={800}
        />
        
      </div>

      <p className="text-sm font-semibold text-black truncate">{product.name}</p>
      <p className="text-xs text-gray-600 truncate max-sm:hidden">{product.description}</p>

      <div className="flex items-center justify-between w-full mt-auto">
        <p className="text-base font-semibold text-black">
          {currency}:{product.offerPrice}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push('/product/' + product.id);
          }}
          className="text-xs text-black border border-black px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition max-sm:hidden"
        >
          Buy now
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
