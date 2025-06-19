import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Step into Style – Premium T-Shirts Now Available!",
      offer: "Summer Sale – Flat 25% Off",
      buttonText1: "Shop Now",
      buttonText2: "See Collection",
      imgSrc: assets.bannerone,
    },
    {
      id: 2,
      title: "Minimal. Bold. Timeless – Explore Our Streetwear Tees",
      offer: "Limited Time Drop!",
      buttonText1: "Buy Now",
      buttonText2: "Browse More",
      imgSrc: assets.bannertwo,
    },
    {
      id: 3,
      title: "Unleash Comfort – Soft Cotton Tees in Trendy Fits",
      offer: "New Arrivals Out Now",
      buttonText1: "Order Today",
      buttonText2: "Know More",
      imgSrc: assets.bannerthree,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const {router}=useAppContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[550px] md:h-[650px] lg:h-[660px] overflow-hidden mt-5 rounded-sm">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData?.map((slide, index) => (
          <div
            key={slide.id}
            className="min-w-full relative h-[600px] md:h-[720px] lg:h-[800px]"
          >
          
            <div className="absolute inset-0 -z-10">
              <Image
                src={slide.imgSrc}
                alt="Background"
                fill
                className="object-cover sm:blur-lg md:blur-none brightness-100"
                priority
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between h-full w-full px-6 md:px-20 py-12">
              <div className="md:w-1/2 text-center md:text-left text-black/70">
                {/* <p className="text-lg mb-2 opacity-90 text-black">{slide.offer}</p> */}
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  {slide.title}
                </h1>
                <motion.div
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col md:flex-row gap-4 mt-6 md:mt-8 justify-center md:justify-start"
                >
                  <button className="px-8 py-3 cursor-pointer bg-white text-black rounded-full text-sm md:text-base font-medium shadow-lg hover:bg-gray-200 transition"
                   onClick={()=>router.push('/all-products')}
                  >
                    {slide.buttonText1}
                  </button>
                  <button className="group flex cursor-pointer  items-center gap-2 px-6 py-3 font-medium text-black text-sm md:text-base"
                    onClick={()=>router.push('/all-products')}
                  >
                    {slide.buttonText2}
                    <Image
                      className="cursor-pointer group-hover:translate-x-1 transition-transform"
                      src={assets.arrow_icon}
                      alt="arrow_icon"
                    />
                  </button>
                </motion.div>
              </div>

              <div className="w-full h-90  m-auto flex justify-center md:hidden    ">
                <Image
                  className="w-full contain-content h-60  shadow-gray-700 shadow-2xl  rounded-md  bg-black/80 brightness-75"
                  src={slide.imgSrc}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="hidden md:absolute md:bottom-6 md:left-1/2 md:transform md:-translate-x-1/2 md:z-20 md:flex md:items-center md:justify-center md:gap-3">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-colors duration-300 ${
              currentSlide === index ? "bg-white" : "bg-gray-800/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
