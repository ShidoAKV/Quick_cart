'use client';
import React, { useState,useEffect } from 'react';
import { UploadCloud } from "lucide-react";
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { AlertTriangle } from "lucide-react";
import jwt from 'jsonwebtoken';


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
    reason: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const refundtoken=searchParams.get('token');
  const { getToken,router } = useAppContext();
  const [isVerified, setIsVerified] = useState(false);
  
  useEffect(() => {
    const verifyToken = async () => {
      if (!refundtoken) return toast.error('wrong link');
      const token=await getToken();
      try {
        const {data} = await axios.post('/api/help/verifyRefundToken',
          {refundtoken},
          {headers: { Authorization: `Bearer ${token}` }}
        );
        if(data.success){
           toast.success('verified successfully')
           setIsVerified(true);
        }else{
           toast.error(data.message)
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    };

    verifyToken();
  }, [refundtoken]);


  const handleCheckChange = (e) => {
    setChecks({ ...checks, [e.target.name]: e.target.checked });
  };

  const allChecked = Object.values(checks).every(Boolean);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
      setFileUploaded(!!e.target.files?.[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId) return toast.error("Order ID is missing in the URL.");
    if (!isVerified) return toast.error("Unauthorized or invalid token.");

    try {
      const token = await getToken();
      const body = new FormData();
      body.append('name', formData.name);
      body.append('email', formData.email);
      body.append('file', formData.file);
      body.append('reason', formData.reason);

      toast.loading('processing...');
      const { data } = await axios.post(`/api/order/refund/${orderId}`, body, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
    <div className="min-h-[90vh] px-4 py-6 bg-gray-950 flex flex-col items-center  justify-center">
      <div className="w-full max-w-md bg-gray-900 p-5 rounded-xl shadow-lg border border-gray-700">

        {!submitted ? (
          <>
            <div className="space-y-3 mb-5">
              <h2 className="text-xl font-semibold text-center mb-2 text-white">Refund Claim Process</h2>

              <p className="text-sm text-gray-400 mb-4 text-center">
                Please confirm the following before proceeding with your refund claim.
              </p>

              {[
                { name: "labelIntact", label: "Product label is not removed" },
                { name: "notDamaged", label: "Item is not damaged or used" },
                { name: "paidFee", label: "₹100 Refund Processing Fee Paid" },
              ].map((checkbox) => (
                <label key={checkbox.name} className="flex items-center gap-2 bg-gray-800 p-2 rounded-md text-sm text-white">
                  <input
                    type="checkbox"
                    name={checkbox.name}
                    checked={checks[checkbox.name]}
                    onChange={handleCheckChange}
                    className="accent-white scale-110"
                  />
                  <span className="flex-1">{checkbox.label}</span>
                  <AlertTriangle className="text-yellow-400 w-4 h-4" />
                </label>
              ))}
            </div>

            {allChecked && (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded-md placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded-md placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Reason</label>
                  <input
                    type="text"
                    name="reason"
                    required
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white border border-gray-600 px-3 py-2 rounded-md placeholder:text-gray-400 focus:ring-2 focus:ring-gray-600"
                    placeholder="Why do you want a refund?"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Upload T-shirt Photo</label>
                  <label
                    className={`flex items-center gap-3 border rounded-md p-3 cursor-pointer transition-colors
                     ${fileUploaded ? 'bg-green-600 border-green-500 hover:bg-green-700' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}
                        `}
                  >
                    <UploadCloud className={`${fileUploaded ? 'text-white' : 'text-gray-400'} w-5 h-5`} />
                    <span className={`${fileUploaded ? 'text-white' : 'text-gray-400'} text-sm`}>
                      {fileUploaded ? 'Image Selected' : 'Choose file'}
                    </span>
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      required
                      onChange={handleInputChange}
                      className="hidden"
                    />
                  </label>
                </div>


                <button
                  type="submit"
                  className="w-full bg-white text-black font-semibold py-2 rounded-md hover:bg-gray-200 transition"
                >
                  Submit Refund Claim
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="text-center  rounded-xl p-6 border border-green-600 shadow-md text-green-400 space-y-4">
            <div className="flex justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-2xl font-semibold text-green-400">Refund Claim Submitted!</h3>

            <p className="text-gray-300 text-sm">
              Your request has been submitted successfully. Please wait for the seller’s approval. Updates will be sent to your  <strong className='cursor-pointer text-green-400' onClick={()=>router.push('/my-orders')}>order page</strong> .
            </p>

            <p className="text-gray-400 text-sm">
              Submitted on: <span className="text-white font-medium">{new Date().toLocaleString()}</span>
            </p>
          </div>

        )}
      </div>
    </div>
  );
};

export default Refundform;
