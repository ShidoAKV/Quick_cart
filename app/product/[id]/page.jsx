"use client";
import { useEffect, useState, useRef } from "react";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { LoaderCircle } from "lucide-react";
import RelatedProducts from "@/components/RelatableProduct";
import CommentOnProduct from "@/components/CommentonProduct";
import { FileQuestion, ArrowLeft } from 'lucide-react';
import ChartSize from "@/components/charsize";


const Product = () => {

  const { id } = useParams();
  const { products, router, addToCart, getToken } = useAppContext();

  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [avgrating, setAvgrating] = useState(0)
  const [ratingcount, setRatingcount] = useState(0);
  const imgContainerRef = useRef(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);




  const checkPurchase = async () => {
    const token = await getToken();
    try {
      const { data } = await axios.post(`/api/product/check-purchased/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setHasPurchased(true);
      } else {
        setHasPurchased(false);
      }
    } catch (err) {
      setHasPurchased(false);
    }
  };

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
    }
  };

  const fetchrating = async () => {
    if (!id) {
      toast.error("Product ID is missing");
      return;
    }

    try {
      const { data } = await axios.get(`/api/product/comment/list/${id}`);
      if (data.success) {
        setAvgrating(data.avgRating);
        setRatingcount(data.ratingCount)
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error("Failed to fetch rating:", error);
    }
  };

  useEffect(() => {
    if (products && products.length > 0) {
      const init = async () => {
        await Promise.all([
          checkPurchase(),
          fetchProductData()
        ]);
      };
      init();
    }
  }, [id, products]);

  useEffect(() => {
    if (id) {
      fetchrating()
    }
  }, [id])


  useEffect(() => {
    if (hasPurchased) {
      const timer = setTimeout(() => setShowComment(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasPurchased]);

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

  return (
    <>

      <div className="px-4 sm:px-6 md:px-16 lg:px-32 pt-8 space-y-10 font-sans text-gray-900 text-sm relative">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 w-full">
          {/* Image Section */}
          <div className="block lg:hidden space-y-2">
            <h1 className="text-2xl font-extrabold tracking-wide">{productData.name}</h1>
            <p className="text-gray-700 px-1 leading-relaxed font-normal mx-auto">{productData.description}</p>
          </div>
          {/* main image */}
          <div className="w-full max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-2">
            {/* Thumbnails (smaller width) */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:w-[60px] flex-shrink-0 order-2 lg:order-none">
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
                        loading="lazy"
                        unoptimized={false}
                        width={300}
                        height={400}
                        className="object-cover"
                      />
                    )}
                  </div>
                ))}
            </div>

            {/* Main Image */}
            <div
              ref={imgContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomVisible(true)}
              onMouseLeave={() => setIsZoomVisible(false)}
              className="relative rounded-sm overflow-hidden border border-gray-300 flex-grow  h-[480px] lg:h-[720px] lg:mx-8   flex items-center justify-center"
            >
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={productData.name}
                  className="h-full w-full "
                  priority
                  width={900}
                  height={600}
                />
              ) : (
                <FileQuestion size={48} className="text-gray-400 mx-auto" />
              )}
            </div>


          </div>
          <div
            onClick={() => router.push("/all-products")}
            title="Back to Products"
            className="fixed top-4 lg:top-80 left-4 z-40 bg-gray-800 backdrop-blur-md border border-gray-300 hover:border-black shadow-sm p-2 sm:p-2.5 rounded-full cursor-pointer  transition-all"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-all" />
          </div>



          <div className="w-full lg:w-[40%] flex flex-col space-y-6 font-medium text-gray-800">
            <div className="hidden lg:block space-y-2">
              <h1 className="text-5xl font-bold tracking-wide">{productData.name}</h1>
              <p className="text-gray-700 text-md leading-relaxed font-normal mx-auto">
                {productData.description}
              </p>
            </div>

            <div >
              <h3 className="text-lg mb-1 px-1 font-semibold text-black">Color</h3>
              <div className="flex gap-3 px-1 cursor-pointer overflow-x-clip scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {productData.colorImageMap &&
                  Object.keys(productData.colorImageMap).map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={` w-9 h-9  rounded-full border-2 ring-1 ring-offset-1 transition duration-150 ${selectedColor === color
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
              <div className="flex items-center  justify-between">
                <h3 className=" text-lg px-1 mb-1 text-black font-semibold ">Size</h3>
                <span className="pr-6   "><ChartSize /></span>
              </div>
              <div className="flex gap-2 px-1 flex-wrap">
                {productData.size?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 cursor-pointer py-2 rounded border  text-md font-bold ${selectedSize === size
                      ? "bg-gray-900 text-white border-black"
                      : "bg-white text-gray-900 border-gray-400 hover:border-black"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Type of tshirt */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">

              <h3 className="text-base sm:text-lg px-1 text-gray-800">{productData?.color[0]}</h3>
            </div>

            {/* Stock */}
            {productData.stock > 0 ? (
              <p className="text-green-700 text-md px-1 font-bold">
                {productData.stock} in stock
              </p>
            ) : (
              <p className="bg-red-600 text-white  text-md font-semibold px-3 py-1 rounded w-fit">
                Out of stock
              </p>
            )}

            {/* Color Selection */}


            {/* Price */}
            <div className="mt-2 px-1">
              <p className="text-3xl font-bold text-green-900">
                ₹{productData.offerPrice}
                <span className="text-lg font-semibold text-gray-500 line-through ml-3">
                  ₹{productData.price}
                </span>
              </p>
            </div>

            {/* Rating */}

            <div className="flex items-center gap-2">

              <div className="flex gap-0.5 px-1 items-center">
                {[1, 2, 3, 4, 5].map((star) => {
                  if (avgrating >= star) {
                    return <FaStar key={star} className="text-yellow-500 text-xl" />;
                  } else if (avgrating >= star - 0.5) {
                    return <FaStarHalfAlt key={star} className="text-yellow-500 text-xl" />;
                  } else {
                    return <FaRegStar key={star} className="text-gray-300 text-xl" />;
                  }
                })}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({avgrating.toFixed(1)} / 5 from {ratingcount} ratings)
              </span>
            </div>

            {/* Zoom Preview */}
            {isZoomVisible && mainImage && (
              <div
                className="absolute backdrop-blur-2xl  rounded-lg border border-gray-300 z-50 hidden md:block"
                style={{
                  width: "400px",
                  height: "400px",
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: "350%",
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundRepeat: "no-repeat",

                }}
              />
            )}

            <hr className="my-4" />

            {/* Cart Actions */}
            {productData?.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    addToCart(productData.id, selectedSize, selectedColor)
                  }
                  className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-black font-bold py-3 px-6 rounded w-full sm:w-[240px]"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(productData.id, selectedSize, selectedColor);
                    router.push("/cart");
                  }}
                  className="bg-gray-900 lg:bg-gray-800 cursor-pointer hover:bg-gray-950 text-white font-bold py-3 px-6 rounded w-full sm:w-[240px]"
                >
                  Buy Now
                </button>
              </div>
            )}

            {/* rating and comment */}
            {hasPurchased && (
              showComment ? (
                <CommentOnProduct productId={id} />
              ) : (
                <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  <span>Loading comment section...</span>
                </div>
              )
            )}

          </div>
        </div>
      </div>


      <RelatedProducts products={products} />

      <Footer />
    </>
  );
};

export default Product;
