'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
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

      if(colorImageMap){
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

     

      const { data } = await axios.post(`/api/product/edit/${id}`, payload, {
        headers: { Authorization: `Bearer ${authToken.current}` },
      });

      if (data.success) {
        toast.success("Product updated");
        setEditingProduct(null);
        router.push('/seller/product-list');
      } else {
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
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex gap-2">
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
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">Edit Product</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <label className="block text-sm mb-2">Offer Price (₹):</label>
                  <input
                    type="number"
                    {...register("offerPrice")}
                    className="w-full mb-4 p-2 border rounded"
                  />

                  <label className="block text-sm mb-2">Colors (comma-separated):</label>
                  <input
                    type="text"
                    {...register("color")}
                    className="w-full mb-4 p-2 border rounded"
                  />

                  <label className="block text-sm mb-2">Stock:</label>
                  <input
                    type="number"
                    {...register("stock")}
                    className="w-full mb-4 p-2 border rounded"
                  />

                  {/* 4 separate image inputs per color */}
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Add Color + Image(s):</label>
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      placeholder="e.g. red, blue, green"
                      className="p-2 border rounded w-full mb-2"
                    />

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {[0, 1, 2, 3].map((i) => (
                        <input
                          key={i}
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
                          className="p-2 border rounded"
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addColorImage}
                      className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700"
                    >
                      Add Color & Image(s)
                    </button>
                  </div>

                  {/* Show preview of color-image map */}
                  <div className="flex flex-wrap gap-2 mb-4 max-h-48 overflow-auto">
                    {Object.entries(colorImageMap).map(([color, images]) =>
                      images
                        ?.filter((img) => img != null)
                        .map((img, idx) => {
                          const fileName = typeof img === "string" ? img : img.name || "Unknown";
                          return (
                            <div key={`${color}-${idx}`} className="flex items-center gap-2 border p-1 rounded">
                              <span
                                className="w-5 h-5 rounded-full border"
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                              />
                              {typeof img === "string" ? (
                                <span className="text-sm text-gray-700 truncate max-w-xs" title={fileName}>
                                  {fileName}
                                </span>
                              ) : (
                                <img
                                  src={URL.createObjectURL(img)}
                                  alt="preview"
                                  className="w-10 h-10 object-cover rounded border"
                                />
                              )}
                            </div>
                          );
                        })
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded"
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
