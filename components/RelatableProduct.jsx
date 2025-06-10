'use client'
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const RelatedProducts = ({ products }) => {
    const containerRef = useRef(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const { router, currency } = useAppContext();
    const scrollAmount = 250;


    const handleScroll = (direction) => {
        if (containerRef.current) {
            const container = containerRef.current;
            container.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };


    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScrollUpdate = () => {
            const index = Math.round(container.scrollLeft / scrollAmount);
            setScrollIndex(index);
        };

        container.addEventListener("scroll", handleScrollUpdate);
        return () => container.removeEventListener("scroll", handleScrollUpdate);
    }, []);


    const visibleProducts = products.slice(0, 4); // You can change the number if needed

    return (
        <div className="mt-24 px-4 md:px-16 lg:px-32">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-wide relative w-fit after:block after:h-1 after:bg-gray-500 after:w-20 after:mt-1 uppercase">
                Related Products
            </h2>

            <div className="relative">
                {/* Scroll buttons */}
                <button
                    onClick={() => handleScroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
                >
                    <ChevronLeft className=" cursor-pointer w-5 h-5 text-gray-700" />
                </button>
                <button
                    onClick={() => handleScroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
                >
                    <ChevronRight className="cursor-pointer w-5 h-5 text-gray-700" />
                </button>

                {/* Product Cards */}
                <div
                    ref={containerRef}
                    className="flex gap-4 mx-0 lg:mx-24 overflow-x-auto scrollbar-none"
                >
                    {visibleProducts?.map((product, index) => {
                        const firstColor = Object.keys(product.colorImageMap || {})[0];
                        const firstImage = product.colorImageMap?.[firstColor]?.[0] || "";

                        return (
                            <div
                                key={index}
                                className="min-w-[240px] max-w-[240px] bg-white shadow-lg mb-5 hover:shadow-md transition cursor-pointer  rounded overflow-hidden"
                            >
                                {firstImage ? (
                                    <Image
                                        src={firstImage}
                                        alt={product.name}
                                        width={240}
                                        height={240}
                                        className="object-contain p-3 w-full h-48"
                                    />
                                ) : (
                                    <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-500">
                                        No Image
                                    </div>
                                )}
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
                                                router.push('/product/' + product.id);
                                            }}
                                            className="cursor-pointer text-xs sm:text-sm border border-green-900 text-green-900 hover:bg-green-900 hover:text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded transition"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center mt-4 gap-2">
                    {visibleProducts.map((_, i) => (
                        <span
                            key={i}
                            className={`w-2 h-2 rounded-full ${scrollIndex === i ? "bg-gray-800" : "bg-gray-400"} transition`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedProducts;