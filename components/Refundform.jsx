'use client';
import React, { useState } from 'react';
import { UploadCloud } from "lucide-react";

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can integrate an API
        console.log(formData);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen px-4 py-12 bg-gray-50 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Refund Claim Process</h2>
                <p className="text-sm text-gray-600 mb-6 text-center">
                    Please confirm the following before proceeding with your refund claim.
                </p>

                {!submitted ? (
                    <>
                        <div className="space-y-3 mb-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="labelIntact"
                                    checked={checks.labelIntact}
                                    onChange={handleCheckChange}
                                    className="accent-black"
                                />
                                <span>Product label is not removed</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="notDamaged"
                                    checked={checks.notDamaged}
                                    onChange={handleCheckChange}
                                    className="accent-black"
                                />
                                <span>Item is not damaged or used</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="paidFee"
                                    checked={checks.paidFee}
                                    onChange={handleCheckChange}
                                    className="accent-black"
                                />
                                <span>₹100 Refund Processing Fee Paid</span>
                            </label>
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
