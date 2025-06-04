'use client';

import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { getToken } = useAppContext();
  const [files, setFiles] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      toast.loading('Uploading...');
      const token = await getToken();
      const { data } = await axios.post('/api/product/add', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.dismiss();
      if (data.success) {
        toast.success(data.message);
        setFiles([]);
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
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-4xl">
        {/* Image Upload */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  id={`image${index}`}
                  hidden
                />
                <Image
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Basic Info */}
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

        {/* Category, Price, Offer Price */}
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
            <label className="text-base font-medium">Product Price</label>
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

        {/* Stock Field */}
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
            </select>
            <div className="flex flex-wrap gap-2 mt-1">
              {size.map((s, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                  {s}
                  <button type="button" onClick={() => setSize(size.filter(item => item !== s))} className="text-red-500 font-bold">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Color Selector with manual input */}
          <div className="flex flex-col gap-1 w-40">
            <label className="text-base font-medium">Color</label>
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
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Blue">Blue</option>
              <option value="Red">Red</option>
              <option value="Green">Green</option>
            </select>

            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Custom color"
                className="outline-none py-2 px-2 rounded border border-gray-500/40 flex-1"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  if (customColor && !color.includes(customColor)) {
                    setColor([...color, customColor]);
                    setCustomColor('');
                  }
                }}
                className="bg-gray-500 text-white px-2 rounded"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-1">
              {color.map((c, idx) => (
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

        <button type="submit" className="px-8 py-2.5 bg-gray-600 hover:bg-gray-800 text-white font-medium rounded">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
