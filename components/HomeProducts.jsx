import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router, currency } = useAppContext();
  const displayedProducts = products?.slice(0, 5);

  return (
    <div className="flex flex-col items-center pt-12 px-1 xl:px-0">
      <p className="text-3xl font-bold text-black">Popular Products</p>
      <div className="w-24 h-1 bg-green-800 mt-2 rounded-full"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8 w-full max-w-screen-xl">
        {displayedProducts?.map((product, index) => (
          <div
            key={index}
            onClick={() => {
              router.push("/product/" + product.id);
              scrollTo(0, 0);
            }}
            className="group shadow-sm flex flex-col rounded-sm overflow-hidden hover:shadow-md transition cursor-pointer w-full max-w-full sm:max-w-[300px]"
          >
            {/* Product Image */}
            <div className="relative w-full h-[380px] sm:h-[240px] lg:h-[340px]">
              <Image
                src={product?.image[0]}
                alt={product?.name}
                fill
                className="object-cover object-top-left"
              />
            </div>


            {/* Product Info */}
            <div className="flex flex-col gap-1 p-3 sm:p-4 text-gray-700">
              <p className="text-lg lg:text-xl font-bold truncate">
                {product.name}
              </p>

              <p className="text-sm sm:text-sm text-gray-500 truncate">
                {product.description}
              </p>

              {product.stock > 0 ? (
                <p className="text-sm text-green-800 font-medium">
                  {product.stock} in stock
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">Out of stock</p>
              )}

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm sm:text-base font-bold text-green-900">
                  {currency}
                  {product.offerPrice}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/product/" + product.id);
                  }}
                  className="cursor-pointer text-xs sm:text-sm border border-green-900 text-green-900 hover:bg-green-900 hover:text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded transition"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/all-products")}
        className="cursor-pointer mt-10 px-8 py-3 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition"
      >
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
