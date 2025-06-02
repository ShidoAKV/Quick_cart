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
   <div className="flex-1 min-h-screen flex flex-col justify-between">
  {loading ? (
    <Loading />
  ) : (
    <div className="w-full md:p-10 ">
      <h2 className="pb-4 text-lg font-medium">All Product</h2>
      <div className="overflow-x-auto w-full ml-0 ">
        <div className="min-w-[640px] md:min-w-0 overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed w-full">
            <thead className="text-gray-900 text-sm text-left sm:overflow-x-scroll md:overflow-auto">
              <tr>
                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                <th className="px-4 py-3 font-medium truncate">Price</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Color</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
                <th className="px-4 py-3 font-medium truncate">Delete</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products?.map((product, index) => (
                <tr key={index} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="bg-gray-500/10 rounded p-2">
                      <Image
                        src={product.image[0]}
                        alt="product Image"
                        className="w-16"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="truncate w-full">{product.name}</span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                  <td className="px-4 py-3">${product.offerPrice}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    <div className="flex gap-1 flex-wrap">
                      {product.color?.map((color, i) => (
                        <div
                          key={i}
                          title={color}
                          className="w-5 h-5 rounded-full border border-gray-400"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    <button
                      onClick={() => router.push(`/product/${product.id}`)}
                      className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
                    >
                      <span className="hidden md:block">Visit</span>
                      <Image className="h-3.5" src={assets.redirect_icon} alt="redirect_icon" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteproduct(product.id)}
                      className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-red-600 text-white rounded-md"
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
    </div>
  )}
  <Footer />
</div>

  );
};

export default ProductList;