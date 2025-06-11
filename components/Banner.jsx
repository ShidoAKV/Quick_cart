'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const allReviews = [
  { id: 1, name: "Rohit Kumar", product: "Oversized Black Tee", size: "L", rating: 5, comment: "Perfect for casual wear, fabric is really soft and breathable. Highly recommend!" },
  { id: 2, name: "Sahil Verma", product: "Plain White T-Shirt", size: "M", rating: 4, comment: "Fits well and the quality feels premium. Will try more colors." },
  { id: 3, name: "Aditya Singh", product: "Graphic Print Tee", size: "XL", rating: 5, comment: "Print is exactly like shown, gives a stylish street look." },
  { id: 4, name: "Anmol Mehta", product: "Round Neck Tee", size: "L", rating: 4, comment: "Looks good after multiple washes, no color fade." },
  { id: 5, name: "Pratik Joshi", product: "Slim Fit Tee", size: "S", rating: 5, comment: "Fits perfectly and doesn’t shrink. Good for gym and casual wear." },
  { id: 6, name: "Karan Sharma", product: "Solid Navy Tee", size: "M", rating: 4, comment: "Love the color and stretch. Ordered 2 more right away." },
];

const Banner = () => {
  const sliderRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const cardWidth = 240 + 16;

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const updateScrollIndex = () => {
      const index = Math.round(container.scrollLeft / cardWidth);
      setScrollIndex(index);
    };

    container.addEventListener('scroll', updateScrollIndex);
    return () => container.removeEventListener('scroll', updateScrollIndex);
  }, []);

  return (
    <div className="mt-20 px-4 md:px-16 lg:px-32 ">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
        What Men Say About Our T-Shirts
      </h2>

      <div className="relative pt-5">
        {/* Scroll buttons */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-[-40px] lg:left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900" />
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-[-40px] lg:right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
        >
          <ChevronRight className="w-5 h-5 text-gray-900" />
        </button>

        {/* Review Cards */}
        <div
          ref={sliderRef}
          className="flex gap-3 lg:gap-4 mx-0 lg:mx-24 overflow-x-auto scrollbar-none scroll-smooth rounded-sm"
        >
          {allReviews.map((review) => (
            <div
              key={review.id}
              className="min-w-[280px] max-w-[280px] bg-gray-800  shadow hover:shadow-md transition rounded p-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-white">{review.name}</p>
                  <p className="text-sm text-gray-300">{review.product} ({review.size})</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-400 max-h-[100px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400">
                {review.comment}
              </p>
            </div>
          ))}
        </div>

        {/* Dot Indicator */}
        <div className="flex justify-center mt-4 gap-2">
          {allReviews.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full ${scrollIndex === i ? 'bg-gray-800' : 'bg-gray-400'} transition`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
