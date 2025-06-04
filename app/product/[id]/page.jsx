"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart } = useAppContext();

  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const imgContainerRef = useRef(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomVisible, setIsZoomVisible] = useState(false);

  const fetchProductData = async () => {
    const product = products.find((product) => product.id === id);
    setProductData(product);

    if (product) {
      setSelectedSize(product.size[0] || null);
      setSelectedColor(product.color[0] || null);
      setMainImage(product.image[0] || null);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products]);

  if (!productData) return <Loading />;

  const handleMouseMove = (e) => {
    if (!imgContainerRef.current) return;

    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Clamp x and y within the image container bounds
    const clampedX = Math.min(Math.max(x, 0), rect.width);
    const clampedY = Math.min(Math.max(y, 0), rect.height);

    setZoomPosition({
      x: (clampedX / rect.width) * 100,
      y: (clampedY / rect.height) * 100,
    });
  };

  
  

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex gap-6 px-5 lg:px-16 xl:px-20">
            {/* Thumbnails vertical on left */}
            <div
              className="flex flex-col gap-4 overflow-y-auto"
              style={{ maxHeight: "450px", width: "110px" }}
            >
              {productData?.image?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`cursor-pointer rounded-lg overflow-hidden  border-2 ${
                    mainImage === image
                      ? "border-green-800"
                      : "border-gray-300"
                  }`}
                  style={{ width: "60px", height: "70px" }}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={60}
                    height={70}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            

            <div
              ref={imgContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomVisible(true)}
              onMouseLeave={() => setIsZoomVisible(false)}
              className="relative rounded-lg overflow-hidden bg-gray-500/10 cursor-crosshair "
              style={{ width: "300px", height: "450px" }}
            >
              <Image
                src={mainImage}
                alt={productData.name}
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

      
          
          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>
             {isZoomVisible && (
              <div
                className=" absolute  rounded-lg overflow-hidden border border-gray-300 scale-z-105 z-50  cursor-crosshair hidden md:block "
                style={{ width: "300px", height: "250px"}}
              >
                <div
                  className="w-full h-full bg-no-repeat bg-contain"
                  style={{
                    backgroundImage: `url(${mainImage})`,
                    backgroundSize: "350%", // zoom factor
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />
              </div>
            )}
        
            <p className="text-gray-600 mt-3">{productData.description}</p>
            <p className="text-3xl font-medium mt-6">
              ₹{productData.offerPrice}
              <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                ₹{productData.price}
              </span>
            </p>
            <hr className="bg-gray-600 my-6" />

            <div>
              <h3 className="font-semibold mb-2">Select Size:</h3>
              <div className="flex gap-3">
                {productData?.size?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border ${
                      selectedSize === size
                        ? "bg-gray-900/90 text-white border-gray-700"
                        : "bg-white text-gray-800 border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>


            

            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Select Color:</h3>
              <div className="flex gap-3">
                {productData?.color?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    aria-label={`Select color ${color}`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <hr className="my-6" />

            {/* Buttons */}
            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={() =>
                  addToCart(productData.id, selectedSize, selectedColor)
                }
                className="cursor-pointer w-full py-3.5 rounded-sm bg-gray-100 text-gray-800 hover:bg-gray-00 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(productData.id, selectedSize, selectedColor);
                  router.push("/cart");
                }}
                className="cursor-pointer w-full py-3.5 rounded-sm bg-gray-900/90 text-white hover:bg-gray-900 transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
