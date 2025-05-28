'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  // Helper to parse composite key: "productId|size|color"
  const parseCartKey = (key) => {
    const [productId, size, color] = key.split('|');
    return { productId, size, color };
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Product Details
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Price
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Size
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Color
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Quantity
                  </th>
                  <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cartItems).map(([cartKey, quantity]) => {
                  if (quantity <= 0) return null;

                  const { productId, size, color } = parseCartKey(cartKey);
                  const product = products.find(p => p._id === productId);

                  if (!product) return null;

                  return (
                    <tr key={cartKey}>
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div>
                          <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                            <Image
                              src={product.image[0]}
                              alt={product.name}
                              className="w-16 h-auto object-cover mix-blend-multiply"
                              width={1280}
                              height={720}
                            />
                          </div>
                          <button
                            className="md:hidden text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(productId, size, color, 0)}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-sm hidden md:block">
                          <p className="text-gray-800 font-semibold">{product.name}</p>
                          <button
                            className="text-xs text-orange-600 mt-1"
                            onClick={() => updateCartQuantity(productId, size, color, 0)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 md:px-4 px-1 text-gray-600">${product.offerPrice.toFixed(2)}</td>

                      {/* Size */}
                      <td className="py-4 md:px-4 px-1 text-gray-700 font-medium">{size}</td>

                      {/* Color */}
                      <td className="py-4 md:px-4 px-1">
                        <span
                          className="inline-block w-6 h-6 rounded-full border"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      </td>

                      {/* Quantity controls */}
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center md:gap-2 gap-1">
                          <button
                            onClick={() => updateCartQuantity(productId, size, color, quantity - 1)}
                            disabled={quantity <= 1}
                            className={`disabled:opacity-40`}
                            aria-label="Decrease quantity"
                          >
                            <Image
                              src={assets.decrease_arrow}
                              alt="decrease_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                          <input
                            onChange={e => {
                              let val = Number(e.target.value);
                              if (val < 1) val = 1; // Minimum quantity 1
                              updateCartQuantity(productId, size, color, val);
                            }}
                            type="number"
                            value={quantity}
                            min={1}
                            className="w-10 border text-center appearance-none"
                            aria-label="Quantity input"
                          />
                          <button
                            onClick={() => addToCart(productId, size, color)}
                            aria-label="Increase quantity"
                          >
                            <Image
                              src={assets.increase_arrow}
                              alt="increase_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="py-4 md:px-4 px-1 text-gray-600">${(product.offerPrice * quantity).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button onClick={() => router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-orange-600">
            <Image
              className="group-hover:-translate-x-1 transition"
              src={assets.arrow_right_icon_colored}
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
