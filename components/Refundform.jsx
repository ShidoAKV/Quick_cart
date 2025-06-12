'use client';
import React, { useState } from 'react';
import { UploadCloud } from "lucide-react";
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const Refundform = () => {
  const [checks, setChecks] = useState({
    labelIntact: false,
    notDamaged: false,
    paidFee: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    file: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id'); 
  const { getToken } = useAppContext();

  const handleCheckChange = (e) => {
    setChecks({ ...checks, [e.target.name]: e.target.checked });
  };

  const allChecked = Object.values(checks).every(Boolean);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId) return toast.error("Order ID is missing in the URL.");
    
    try {
      const token = await getToken();
      const body = new FormData();
      body.append('name', formData.name);
      body.append('email', formData.email);
      body.append('file', formData.file);
      toast.loading('processing...')
      const { data } = await axios.post(`/api/order/refund/${orderId}`, body, {
        headers: {
          'Authorization':`Bearer ${token}`,
        },
      });
     
      if (data.success) {
        toast.success(data.message || "Refund submitted successfully");
        setSubmitted(true);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    toast.dismiss();
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-900 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Refund Claim Process</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Please confirm the following before proceeding with your refund claim.
        </p>

        {!submitted ? (
          <>
            <div className="space-y-3 mb-6">
              {[
                { name: "labelIntact", label: "Product label is not removed" },
                { name: "notDamaged", label: "Item is not damaged or used" },
                { name: "paidFee", label: "₹100 Refund Processing Fee Paid" },
              ].map((checkbox) => (
                <label key={checkbox.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={checkbox.name}
                    checked={checks[checkbox.name]}
                    onChange={handleCheckChange}
                    className="accent-black"
                  />
                  <span>{checkbox.label}</span>
                </label>
              ))}
            </div>

            {allChecked && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:ring focus:ring-black/30"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:ring focus:ring-black/30"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-900 mb-2">
                    Upload T-shirt Photo
                  </label>
                  <div className="flex items-center gap-4 bg-gray-100 border-2 border-dashed border-gray-400 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                    <UploadCloud className="text-gray-600 w-6 h-6" />
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      required
                      onChange={handleInputChange}
                      className="w-full text-sm text-gray-700 file:hidden focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Submit Refund Claim
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="text-center text-green-600 space-y-4">
            <h3 className="text-xl font-semibold">Refund Claim Submitted!</h3>
            <p>
              Please wait for the seller's approval. You will be notified on your registered email.
            </p>
            <p className="text-gray-600 text-sm">
              Claim submitted on: <strong>{new Date().toLocaleString()}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Refundform;
