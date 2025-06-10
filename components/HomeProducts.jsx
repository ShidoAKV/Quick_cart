import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();
  const displayedProducts = products?.slice(0, 5);

  return (
    <div className="flex flex-col items-center pt-12 px-1 xl:px-0">
       <p className="text-3xl font-bold text-black">Popular Products</p>
        <div className="w-24 h-1 bg-green-800 mt-2 rounded-full"></div>

      <div className="grid grid-cols-1  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8 w-full max-w-screen-xl">
        {displayedProducts?.map((product, index) => (
          <ProductCard key={index} product={product} />
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
