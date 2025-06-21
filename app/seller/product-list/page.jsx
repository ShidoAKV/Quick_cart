'use client';
import React, { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const ProductList = () => {
  const { router, authToken, user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const [colorInput, setColorInput] = useState("");
  const [colorImageMap, setColorImageMap] = useState({});
  const [imageInputs, setImageInputs] = useState([null, null, null, null]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchSellerProduct = async () => {
    try {
      const { data } = await axios.get('/api/product/seller-list', {
        headers: { Authorization: `Bearer ${authToken.current}` }
      });
      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      toast.loading('Processing...');
      const { data } = await axios.post(`/api/product/delete/${productId}`, {}, {
        headers: { Authorization: `Bearer ${authToken.current}` }
      });
      toast.dismiss();
      if (data.success) {
        toast.success('Product deleted successfully');
        fetchSellerProduct();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    }
  };


  const addColorImage = () => {
    const colorList = colorInput.split(',').map(c => c.trim().toLowerCase()).filter(Boolean);
    const validImages = imageInputs.filter(file => file !== null);

    if (!colorList.length) {
      toast.error("Please enter at least one valid color.");
      return;
    }

    if (!validImages.length) {
      toast.error("Please select at least one image.");
      return;
    }

    if (validImages.length > 4) {
      toast.error("You can upload a maximum of 4 images per color.");
      return;
    }

    setColorImageMap(prev => {
      const updated = { ...prev };
      colorList.forEach(color => {
        const existing = updated[color] || [];
        updated[color] = [...existing, ...validImages];
      });
      return updated;
    });

    setColorInput("");
    setImageInputs([null, null, null, null]);
  };

  const onSubmit = async (formData) => {
    try {
      const { offerPrice, color, stock } = formData;
      const { id } = editingProduct;
      const payload = new FormData();

      payload.append("offerPrice", offerPrice);
      payload.append("stock", stock);

      if (color) {
        const colorArray = color.split(',').map(c => c.trim());
        payload.append("color", JSON.stringify(colorArray));
      }

      if (colorImageMap) {
        const rawColorMap = {};
        Object.entries(colorImageMap).forEach(([color, files]) => {
          const filenames = [];
          files.forEach(file => {
            if (typeof file === "string") {
              filenames.push(file);
            } else {

              payload.append("images", file);
              filenames.push(file.name);
            }
          });

          rawColorMap[color] = filenames;
        });
        payload.append("colorImageMap", JSON.stringify(rawColorMap));
      }

        toast.loading('Editing...')

      const { data } = await axios.post(`/api/product/edit/${id}`, payload, {
        headers: { Authorization: `Bearer ${authToken.current}` },
      });

      if (data.success) {
         toast.dismiss()
        toast.success("Product updated");
        setEditingProduct(null);
        router.push('/seller/product-list');
      } else {
         toast.dismiss()
        toast.error(data.message);
      }
     
    } catch (err) {
      toast.error("Update failed: " + err.message);
    }
  };

  useEffect(() => {
    if (user) fetchSellerProduct();
  }, [user]);

  useEffect(() => {
    if (editingProduct) {
      setValue("offerPrice", editingProduct.offerPrice);
      setValue("color", Array.isArray(editingProduct.color) ? editingProduct.color.join(", ") : editingProduct.color);
      setValue("stock", editingProduct.stock);
      setColorImageMap(editingProduct.colorImageMap || {});
      setImageInputs([null, null, null, null]);
      setColorInput("");
    }
  }, [editingProduct, setValue]);

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
                  <th className="px-4 py-3 hidden md:table-cell">Stock</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Visit</th>
                  <th className="px-4 py-3">Edit</th>
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
                    <td className="px-4 py-3 text-gray-700 font-medium">₹{product.offerPrice}</td>
                    <td className="px-4 py-3 hidden sm:table-cell overflow-x-scroll">
                      <div className="flex gap-2 ">
                        {product?.colorImageMap &&
                          Object.keys(product.colorImageMap).map((color) => (
                            <span
                              key={color}
                              className="w-5 h-5 rounded-full border border-gray-300 inline-block mr-1"
                              style={{ backgroundColor: color.toLowerCase() }}
                              title={color}
                              aria-label={color}
                            />
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-800">{product.stock}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <button
                        onClick={() => router.push(`/product/${product.id}`)}
                        className="text-sm bg-green-800 text-white px-3 py-1.5 rounded hover:bg-green-900"
                      >
                        Visit
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditingProduct({ ...product })}
                        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                      >
                        Edit
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

          {editingProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-[#1e1e1e] text-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Edit Product</h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Offer Price (₹):</label>
                    <input
                      type="number"
                      {...register("offerPrice")}
                      className="w-full p-2 bg-[#2b2b2b] border border-gray-600 rounded text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Colors (comma-separated):</label>
                    <input
                      type="text"
                      {...register("color")}
                      className="w-full p-2 bg-[#2b2b2b] border border-gray-600 rounded text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Stock:</label>
                    <input
                      type="number"
                      {...register("stock")}
                      className="w-full p-2 bg-[#2b2b2b] border border-gray-600 rounded text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Color input with icon file selectors */}
                  <div>
                    <label className="block text-sm mb-1">Add Color + Image(s):</label>
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      placeholder="e.g. red, blue"
                      className="w-full p-2 bg-[#2b2b2b] border border-gray-600 rounded text-white placeholder-gray-400 mb-2"
                    />

                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map((i) => (
                        <label
                          key={i}
                          className="flex items-center justify-center h-12 border border-gray-600 rounded cursor-pointer hover:bg-gray-700 transition"
                        >
                          <UploadCloud/>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setImageInputs((prev) => {
                                const updated = [...prev];
                                updated[i] = file;
                                return updated;
                              });
                            }}
                            className="hidden"
                          />
                          
                        </label>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addColorImage}
                      className="mt-3 bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded text-sm"
                    >
                      Add Color & Image(s)
                    </button>
                  </div>

                  {/* Preview */}
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-auto">
                    {Object.entries(colorImageMap).map(([color, images]) =>
                      images?.filter(Boolean).map((img, idx) => {
                        const fileName = typeof img === "string" ? img : img.name || "Unknown";
                        return (
                          <div key={`${color}-${idx}`} className="flex items-center gap-2 border border-gray-600 p-1 rounded">
                            <span
                              className="w-4 h-4 rounded-full border border-white"
                              style={{ backgroundColor: color.toLowerCase() }}
                              title={color}
                            />
                            {typeof img === "string" ? (
                              <span className="text-xs truncate max-w-[100px]" title={fileName}>
                                {fileName}
                              </span>
                            ) : (
                              <img
                                src={URL.createObjectURL(img)}
                                alt="preview"
                                className="w-8 h-8 object-cover rounded border border-gray-500"
                              />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductList;
