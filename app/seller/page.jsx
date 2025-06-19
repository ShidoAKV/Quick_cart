'use client';

import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Men');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [customColor, setCustomColor] = useState('');
  const [stock, setStock] = useState('');
  const [colorImageMap, setColorImageMap] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(offerPrice) > parseFloat(price)) {
      toast.error("Offer price cannot be greater than product price.");
      return;
    }

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('offerPrice', offerPrice);
    formData.append('material', material);
    formData.append('size', JSON.stringify(size));
    formData.append('color', JSON.stringify(color));
    formData.append('stock', stock);

    const rawColorMap = {};

    colorImageMap.forEach((entry) => {
      const { color, images } = entry;
      const validImages = images.filter(file => file);

      validImages.forEach(file => {
        formData.append('images', file);
      });

      rawColorMap[color] = validImages.map(file => file.name);
    });

    formData.append('colorImageMap', JSON.stringify(rawColorMap));

    try {
      if (isLoading) return;
      setIsLoading(true);
      toast.loading('Uploading...');

      const token = await getToken();
      const { data } = await axios.post('/api/product/add', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.dismiss();
      if (data.success) {
        toast.success(data.message);
        setName('');
        setDescription('');
        setCategory('Men');
        setPrice('');
        setOfferPrice('');
        setMaterial('');
        setSize([]);
        setColor([]);
        setStock('');
        setCustomColor('');
        setColorImageMap([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const addColorEntry = () => {
    setColorImageMap(prev => {
      if (prev.some(entry => entry.color === '')) {
        toast.error("Please fill the previous color name before adding new one.");
        return prev;
      }
      return [...prev, { color: '', images: [null, null, null, null] }];
    });
  };

  const handleAddCustomColor = () => {
    const trimmed = customColor.trim();
    if (trimmed && !color.includes(trimmed)) {
      setColor([...color, trimmed]);
      setCustomColor('');
    } else {
      toast.error("Color already added or empty");
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-4xl">
        <button
          type="button"
          onClick={addColorEntry}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          + Add Color
        </button>

        {colorImageMap?.map((entry, idx) => (
          <div key={idx} className="border p-3 mt-3 rounded relative">
            <button
              type="button"
              onClick={() => {
                const updated = colorImageMap.filter((_, i) => i !== idx);
                setColorImageMap(updated);
              }}
              className="absolute cursor-pointer top-1 right-1 text-red-600 font-bold text-lg"
              title="Remove this entry"
            >
              ×
            </button>

            <input
              type="text"
              placeholder="Color name"
              value={entry.color}
              onChange={(e) => {
                const updated = [...colorImageMap];
                updated[idx].color = e.target.value;
                setColorImageMap(updated);
              }}
              className="border p-2 rounded w-40 mb-2"
              required
            />

            <div className="flex gap-3">
              {entry.images.map((img, imgIdx) => (
                <label key={imgIdx}>
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      const updated = [...colorImageMap];
                      updated[idx].images[imgIdx] = e.target.files[0];
                      setColorImageMap(updated);
                    }}
                  />
                  <Image
                    src={img ? URL.createObjectURL(img) : assets.upload_area}
                    alt="preview"
                    width={80}
                    height={80}
                    className="cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}


        {/* Basic Fields */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Name</label>
          <input
            type="text"
            placeholder="Type here"
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium">Product Description</label>
          <textarea
            rows={4}
            className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        {/* Category, Price, Offer */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Category</label>
            <select
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Price</label>
            <input
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">Offer Price</label>
            <input
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-1 w-40">
          <label className="text-base font-medium">Stock</label>
          <input
            type="number"
            min={0}
            placeholder="e.g. 10"
            className="outline-none py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setStock(e.target.value)}
            value={stock}
            required
          />
        </div>

        {/* Material, Size, Color */}
        <div className="flex flex-wrap gap-5">
          <div className="flex flex-col gap-1 w-40">
            <label className="text-base font-medium">Material</label>
            <input
              type="text"
              placeholder="Cotton, Polyester"
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setMaterial(e.target.value)}
              value={material}
              required
            />
          </div>

          {/* Size Selector */}
          <div className="flex flex-col gap-1 w-40">
            <label className="text-base font-medium">Size</label>
            <select
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => {
                const selected = e.target.value;
                if (selected && !size.includes(selected)) {
                  setSize([...size, selected]);
                }
              }}
              value=""
            >
              <option value="">Select</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="3XXL">3XXL</option>
            </select>
            <div className="flex flex-wrap gap-2 mt-1">
              {size?.map((s, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                  {s}
                  <button type="button" onClick={() => setSize(size.filter(item => item !== s))} className="text-red-500 font-bold">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="flex flex-col gap-1 w-40">
            <label className="text-base font-medium">Type</label>
            <select
              className="outline-none py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => {
                const selected = e.target.value;
                if (selected && !color.includes(selected)) {
                  setColor([...color, selected]);
                }
              }}
              value=""
            >
              <option value="">Select</option>
              <option value="Plain">Plain</option>
              <option value="Oversized">Oversized</option>
              <option value="Printed">Printed</option>
            </select>



            <div className="flex flex-wrap gap-2 mt-1">
              {color?.map((c, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                  {c}
                  <button type="button" onClick={() => setColor(color.filter(item => item !== c))} className="text-red-500 font-bold">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="px-8 py-2.5 bg-gray-600 hover:bg-gray-800 text-white font-medium rounded">
          {isLoading ? "Uploading..." : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
