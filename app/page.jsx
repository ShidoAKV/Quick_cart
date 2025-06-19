'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import FeaturedProduct from "@/components/FeaturedProduct";
import Footer from "@/components/Footer";
import TrustSection from "@/components/Tshirtsection";
const Home = () => {
  
  return (
    <>
      
         <div className=" px-6 md:px-16 lg:px-32 ">
        <HeaderSlider />
        <HomeProducts /> 
         <FeaturedProduct />
         <TrustSection/>
         <Banner />

        </div>
        <Footer />
    </>
  );
};

export default Home;
