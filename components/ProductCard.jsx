import React from 'react';
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
      className="group flex flex-col bg-white hover:bg-[#f3f4f6] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer w-full max-w-[300px]"
    >
      {/* Image section fills top */}
      <div className="relative w-full h-60">
        <Image
          src={product?.image[0]}
          alt={product?.name}
          fill
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content section */}
      <div className="flex flex-col gap-2 p-3">
        <p className="text-base font-semibold text-gray-900 truncate">{product.name}</p>
        <p className="text-sm text-gray-600 truncate sm:block hidden">{product.description}</p>
        {
          product.stock > 0 ? (<p className="text-sm text-green-700 truncate ">
            {product.stock} stock remaining
          </p>) : (
            <p className="text-sm text-red-600 truncate ">
              Out of stock
            </p>
          )

        }
        <div className="flex items-center justify-between w-full mt-auto">
          <p className="text-sm sm:text-base font-bold text-gray-800">
            {currency}{product.offerPrice}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push('/product/' + product.id);
            }}
            className="cursor-pointer text-xs sm:text-sm border border-gray-800 hover:bg-gray-900 text-gray-800 hover:text-white px-3 py-1 rounded-full transition duration-200"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
