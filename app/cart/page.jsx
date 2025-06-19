'use client'
import React, { useEffect } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  

  useEffect(() => {
    if (products) {
      router.push('/cart')
    }
  }, [products])


  return (
    <>
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-gray-900">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-separate border-spacing-y-4">
              <thead className="text-left ">
                <tr className="text-sm md:text-base text-gray-700">
                  <th className="pb-2 md:px-4 px-2 font-semibold">Product Details</th>
                  <th className="pb-2 md:px-4 px-2 font-semibold">Price</th>
                  <th className="pb-2 md:px-4 px-2 font-semibold">Size</th>
                  <th className="pb-2 md:px-4 px-2 font-semibold">Color</th>
                  <th className="pb-2 md:px-10 px-2 font-semibold">Quantity</th>
                  <th className="pb-2 md:px-4 px-2 font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cartItems).map(([cartKey, item]) => {
                  if (!item || item.quantity <= 0) return null;

                  const { productId, size, color, quantity } = item;
                  const product = products.find((p) => p.id === productId);
                  if (!product) return null;

                  return (
                    <tr key={cartKey} className="bg-white shadow-sm rounded-md">
                      <td className="py-3 px-2 md:px-4">
                        <div className="flex items-center gap-4">
                          <div className="rounded-md overflow-hidden bg-gray-100 p-1 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              width={90}
                              height={70}
                              className="object-cover rounded-md p-0.5 "
                            />
                          </div>
                          <div>
                            <p className="text-gray-800 font-medium text-sm md:text-base">{product.name}</p>
                            <button
                              className="text-xs cursor-pointer text-red-600 mt-1 hover:underline"
                              onClick={() => updateCartQuantity(productId, size, color, 0)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-2 md:px-4 text-gray-700">₹{product.offerPrice.toFixed(2)}</td>
                      <td className="py-3 px-2 md:px-4 font-medium text-gray-800">{size}</td>
                      <td className="py-3 px-2 md:px-4">
                        <span
                          className="inline-block w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      </td>

                      <td className="py-3 px-2 md:px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(productId, size, color, quantity - 1)}
                            disabled={quantity <= 1}
                            className="w-8 h-8 cursor-pointer flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            min={1}
                            className="w-12 cursor-pointer border border-gray-300 text-center rounded-md text-sm"
                            onChange={(e) => {
                              let val = Number(e.target.value);
                              if (val < 1 || isNaN(val)) val = 1;
                               updateCartQuantity(productId, size, color, val);
                            }}
                          />
                          <button
                            onClick={() => addToCart(productId, size, color)}
                            className="w-8 h-8 cursor-pointer flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-2 md:px-4 text-gray-700">
                        ₹{(product.offerPrice * quantity).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button onClick={() => router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-gray-900">
            <Image
              className="cursor-pointer group-hover:-translate-x-1 transition scale-x-[-1]  "
              src={assets.arrow_icon}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>
        <OrderSummary />
      </div>
    </>
  );
};

export default Cart;
