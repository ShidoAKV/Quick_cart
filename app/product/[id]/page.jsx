"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";


const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart } = useAppContext();

  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const imgContainerRef = useRef(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);




  const fetchProductData = () => {
    const product = products.find((product) => String(product.id) === String(id));
    setProductData(product);

    if (product) {
      const defaultColor = product.colorImageMap && Object.keys(product.colorImageMap).length > 0
        ? Object.keys(product.colorImageMap)[0]
        : null;

      const defaultImages = defaultColor ? product.colorImageMap[defaultColor] : null;

      setSelectedSize(product.size?.[0] || null);
      setSelectedColor(defaultColor);
      setMainImage(defaultImages ? defaultImages[0] : null);
      setUserRating(product.rating || 0);
    }
  };

  useEffect(() => {
    if (products && products.length > 0) {
      fetchProductData();
    }
  }, [id, products]);

  if (!productData) return <Loading />;

  const handleMouseMove = (e) => {
    if (!imgContainerRef.current) return;

    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clampedX = Math.min(Math.max(x, 0), rect.width);
    const clampedY = Math.min(Math.max(y, 0), rect.height);

    setZoomPosition({
      x: (clampedX / rect.width) * 100,
      y: (clampedY / rect.height) * 100,
    });
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const images = productData?.colorImageMap?.[color] || [];
    setMainImage(images[0] || null);
  };

  const handleRatingSubmit = async (rating) => {
    if (!productData || submitting) return;

    setSubmitting(true);
    try {
      await axios.put("/api/product/rating", {
        productId: productData.id,
        rating: rating,
      });
      setUserRating(rating);
      toast.success("Rating submitted successfully");
    } catch (error) {
      toast.error("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 md:px-16 lg:px-32 pt-14 space-y-10 font-sans text-gray-900 text-sm relative">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 w-full">

          {/* Image Section */}
          <div className="w-full lg:w-[60%] flex flex-col lg:flex-row gap-4">

            <div className="flex lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-y-auto lg:w-[80px] order-2 lg:order-none">
              {selectedColor &&
                productData.colorImageMap?.[selectedColor]?.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setMainImage(image)}
                    className={`cursor-pointer relative rounded-md overflow-hidden border-2 ${mainImage === image ? "border-green-900" : "border-gray-300"}`}
                    style={{ width: "60px", height: "70px", flexShrink: 0 }}
                  >
                    {image && (
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                ))}
            </div>


            <div
              ref={imgContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomVisible(true)}
              onMouseLeave={() => setIsZoomVisible(false)}
              className="relative overflow-hidden border border-gray-200 bg-white w-full h-[400px] lg:h-[600px]"
            >
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={productData.name}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[40%] flex flex-col space-y-5 font-medium text-gray-800 ">
            <h1 className="text-5xl font-semibold tracking-wide">{productData.name}</h1>
            
             <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Rating:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingSubmit(star)}
                    className={`cursor-pointer text-2xl ${
                      star <= (userRating || productData.rating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    <FaStar />
                  </span>
                ))}
              </div>

              <span className="text-sm text-gray-600">
                ({(userRating || productData.rating).toFixed(1)}/5)
              </span>
            </div>


            {productData.stock > 0 ? (
              <p className="text-green-700 text-md font-bold">
                {productData.stock} in stock
              </p>
            ) : (
              <p className="bg-red-600 text-white text-md font-semibold px-3 py-1 rounded w-fit">
                Out of stock
              </p>
            )}

            <div>
              <h3 className=" text-lg mb-1 font-semibold"> Color</h3>
              <div className="flex gap-3 cursor-pointer overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {productData.colorImageMap &&
                  Object.keys(productData.colorImageMap).map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`w-9 h-9 cursor-pointer rounded-full border-2 ring-1 ring-offset-1 transition duration-150 ${selectedColor === color
                        ? "border-black ring-black"
                        : "border-gray-300 ring-transparent"
                        }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      aria-label={`Select color ${color}`}
                      title={color}
                    />
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1 "> Size</h3>
              <div className="flex gap-2 flex-wrap">
                {productData.size?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-1.5 rounded cursor-pointer border text-sm font-semibold tracking-wide ${selectedSize === size
                      ? "bg-gray-800 text-white border-black"
                      : "bg-white text-gray-00 border-gray-400 hover:border-black"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <p className="text-3xl font-bold text-green-900">
                ₹{productData.offerPrice}
                <span className="text-lg font-semibold text-gray-500 line-through ml-3">
                  ₹{productData.price}
                </span>
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed font-normal">{productData.description}</p>

            {isZoomVisible && mainImage && (
              <div
                className="absolute backdrop-blur-2xl rounded-lg border border-gray-300 z-50 hidden md:block"
                style={{
                  width: "300px",
                  height: "250px",
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: "330%",
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            <hr className="my-4" />

            {productData.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    addToCart(productData.id, selectedSize, selectedColor)
                  }
                  className="bg-gray-100 cursor-pointer text-base hover:bg-gray-200 border  text-black font-bold py-3 px-6 rounded w-full sm:w-[240px] transition duration-200"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(productData.id, selectedSize, selectedColor);
                    router.push("/cart");
                  }}
                  className="bg-gray-800 cursor-pointer text-base hover:bg-gray-900 text-white font-bold py-3 px-6 rounded w-full sm:w-[240px] transition duration-200"
                >
                  Buy Now
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
