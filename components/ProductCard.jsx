import React from 'react';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();
  console.log(product);
  

  return (
    <div
      onClick={() => {
        router.push('/product/' + product.id);
        scrollTo(0, 0);
      }}
      className="group  shadow-sm flex flex-col rounded-sm overflow-hidden hover:shadow-md transition cursor-pointer w-full max-w-full sm:max-w-[300px]"
    >
      {/* Product Image */}
      <div className="relative w-full   h-48 sm:h-60  ">
        <Image
          src={product?.image[0]}
          alt={product?.name}
          fill 
          className="object-contain p-3"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 p-3 sm:p-4 text-gray-800">
        <p className="text-sm sm:text-base font-medium truncate">{product.name}</p>
        <p className="text-xs sm:text-sm text-gray-500 truncate">{product.description}</p>

        {product.stock > 0 ? (
          <p className="text-xs sm:text-sm text-green-800 font-medium">
            {product.stock} in stock
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-red-600 font-medium">Out of stock</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm sm:text-base font-bold text-green-900">
            {currency}{product.offerPrice}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push('/product/'+ product.id);
            }}
            className="cursor-pointer text-xs sm:text-sm border border-green-900 text-green-900 hover:bg-green-900 hover:text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
