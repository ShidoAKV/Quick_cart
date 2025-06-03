'use client'
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {

  const { router, authToken, user } = useAppContext()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellerProduct = async () => {
    try {
      // const token=await getToken();
      const { data } = await axios.get('/api/product/seller-list', { headers: { Authorization: `Bearer ${authToken.current}` } });

      if (data.success) {
        setProducts(data.products)
        setLoading(false)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const deleteproduct=async(productId)=>{
    try {
      
        toast.loading('processing...')
        const {data}=await axios.post(`/api/product/delete/${productId}`,{ headers: { Authorization: `Bearer ${authToken.current}` } });
      
        if (data.success) {
           toast.dismiss();
           toast.success('product deleted successfully')
           fetchSellerProduct();
      } else {
        toast.dismiss();
        toast.error(data.message);
      }

    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    }
  }



  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user])

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-white">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full p-4 md:p-10">
          <h2 className="pb-4 text-lg font-semibold text-gray-800">All Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-300 rounded-md">
              <thead className="bg-gray-100 text-gray-800">
                <tr className="text-left">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 hidden md:table-cell">Colors</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Visit</th>
                  <th className="px-4 py-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-3 max-w-[200px]">
                      <Image
                        src={product.image[0]}
                        alt="Product Image"
                        width={48}
                        height={48}
                        className="rounded-md object-cover w-12 h-12"
                      />
                      <span className="truncate">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell truncate">{product.category}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">${product.offerPrice}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {product.color?.map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <button
                        onClick={() => router.push(`/product/${product.id}`)}
                        className="text-sm bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-600"
                      >
                        Visit
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-sm bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;