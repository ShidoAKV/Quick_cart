"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart, getToken } = useAppContext();

  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imgContainerRef = useRef(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomVisible, setIsZoomVisible] = useState(false);

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
      setUserRating(null); // Reset userRating
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

  const handleRatingSubmit = async (e) => {
    const selectedRating = parseInt(e.target.value);
    if (!selectedRating || !productData) return;

    try {
      setIsSubmitting(true);
      const token = await getToken();

      const { data } = await axios.post(
        "/api/product/rating",
        {
          productId: productData.id,
          rating: selectedRating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setUserRating(selectedRating);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };


  const avgRating = productData.ratingcount
    ? productData.rating / productData.ratingcount
    : 0;
  
  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 md:px-16 lg:px-32 pt-12 space-y-10 font-sans text-gray-900 text-sm relative">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 w-full">
          {/* Image Section */}
          <div className="w-full xl:w-full flex flex-col lg:flex-row gap-2 max-w-[1280px] mx-auto">
            {/* Thumbnails (smaller width) */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:w-[60px] order-2 lg:order-none">
              {selectedColor &&
                productData?.colorImageMap?.[selectedColor]?.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setMainImage(image)}
                    className={`cursor-pointer relative rounded-md overflow-hidden border-2 ${mainImage === image ? "border-green-900" : "border-gray-300"
                      }`}
                    style={{ width: "50px", height: "60px", flexShrink: 0 }}
                  >
                    {image && (
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                         width={300}
                         height={400}
                         className="object-cover"
                      />
                    )}
                  </div>
                ))}
            </div>

            {/* Main Image: Full width with reduced gap */}
            <div
              ref={imgContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomVisible(true)}
              onMouseLeave={() => setIsZoomVisible(false)}
              className="relative rounded-sm overflow-hidden border border-gray-300 flex-grow h-[450px] lg:h-[700px]  flex items-center justify-center"
            >
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={productData.name}
                  className="w-[500px] h-[450px]   lg:w-[700px] lg:mt-60 lg:h-[950px] object-cover"
                  width={900}
                  height={600}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>




          <div className="w-full lg:w-[40%] flex flex-col space-y-6 font-medium text-gray-800">
            <h1 className="text-2xl font-bold  lg:text-5xl lg:font-semibold tracking-wide">{productData.name}</h1>


            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Rating:</span>
              <div className="flex gap-0.5 items-center">
                {[1, 2, 3, 4, 5].map((star) => {
                  if (avgRating >= star) {
                    return <FaStar key={star} className="text-yellow-500 text-xl" />;
                  } else if (avgRating >= star - 0.5) {
                    return <FaStarHalfAlt key={star} className="text-yellow-500 text-xl" />;
                  } else {
                    return <FaRegStar key={star} className="text-gray-300 text-xl" />;
                  }
                })}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({avgRating.toFixed(1)} / 5 from {productData.ratingcount} ratings)
              </span>
            </div>

            {/* Stock */}
            {productData.stock > 0 ? (
              <p className="text-green-700 text-xl font-bold">
                {productData.stock} in stock
              </p>
            ) : (
              <p className="bg-red-600 text-white text-xl font-semibold px-3 py-1 rounded w-fit">
                Out of stock
              </p>
            )}

            {/* Color Selection */}
            <div>
              <h3 className="text-lg mb-1 font-semibold">Color</h3>
              <div className="flex gap-3 cursor-pointer overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {productData.colorImageMap &&
                  Object.keys(productData.colorImageMap).map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`w-9 h-9 rounded-full border-2 ring-1 ring-offset-1 transition duration-150 ${selectedColor === color
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

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold text-lg mb-1 ">Size</h3>
              <div className="flex gap-2 flex-wrap">
                {productData.size?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 rounded border  text-md font-bold ${selectedSize === size
                      ? "bg-gray-900 text-white border-black"
                      : "bg-white text-gray-700 border-gray-400 hover:border-black"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mt-2">
              <p className="text-3xl font-bold text-green-900">
                ₹{productData.offerPrice}
                <span className="text-lg font-semibold text-gray-500 line-through ml-3">
                  ₹{productData.price}
                </span>
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed font-normal">{productData.description}</p>

            {/* Zoom Preview */}
            {isZoomVisible && mainImage && (
              <div
                className="absolute backdrop-blur-2xl rounded-lg border border-gray-300 z-50 hidden md:block"
                style={{
                  width: "400px",
                  height: "400px",
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: "330%",
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            <hr className="my-4" />

            {/* Cart Actions */}
            {productData.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    addToCart(productData.id, selectedSize, selectedColor)
                  }
                  className="bg-gray-100 hover:bg-gray-200 text-black font-bold py-3 px-6 rounded w-full sm:w-[240px]"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(productData.id, selectedSize, selectedColor);
                    router.push("/cart");
                  }}
                  className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded w-full sm:w-[240px]"
                >
                  Buy Now
                </button>
              </div>
            )}

            {/* Rating Input */}
            <div className="mt-4">
              <label htmlFor="rating" className="text-sm font-semibold block mb-1">
                Rate this product:
              </label>
              <select
                id="rating"
                className="border rounded px-2 py-1 text-sm"
                onChange={handleRatingSubmit}
                value={""}
                disabled={isSubmitting}
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
