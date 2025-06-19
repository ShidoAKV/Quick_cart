'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const Banner = () => {
  const { topcomment, fetchcomment } = useAppContext();
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
    fetchcomment();
  }, []);

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
    <div className="mt-20 px-4 md:px-16 lg:px-32">
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
          {topcomment?.map((review, index) => (
            <div
              key={index}
              className="min-w-[280px] max-w-[280px] bg-gradient-to-r from-black  to-gray-800 shadow hover:shadow-md transition rounded p-10"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-white">{review.user.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-300 py-2">{review.product.name}</p>
                <p className="text-sm text-gray-300 flex gap-2">
                  {review?.product?.size?.map((s,index)=> (
                    <span key={index} className="bg-blue-600 text-white rounded-sm px-1">{s}</span>
                  ))}
                </p>

              </div>
              <div className="flex items-center gap-1 mb-2 py-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300 max-h-[100px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* Dot Indicator */}
        <div className="flex justify-center mt-4 gap-2">
          {topcomment?.slice(0, 6).map((_, i) => (
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
