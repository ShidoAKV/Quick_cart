'use client';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';
import { Trash } from 'lucide-react';

const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XXL'];

const Chartsize = () => {
    const [type, setType] = useState('');
    const [selectedSizes, setSelectedSizes] = useState([]);
    const { getToken, sizechart, setsizechart } = useAppContext();

    const handleChartDelete = async (id) => {
        toast.loading('Deleting...');
        try {

            const token = await getToken();
            const { data } = await axios.post(`/api/product/sizechart/delete`, { id }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.dismiss();
            if (data.success) {
                toast.success('Deleted');
                setsizechart(prev =>
                    prev.map(entry => ({
                        ...entry,
                        sizes: Object.fromEntries(
                            Object.entries(entry.sizes).filter(([_, val]) => val.id !== id)
                        )
                    }))
                );
            }
        } catch (err) {
            toast.dismiss(loading);
            toast.error('Error deleting size');
        }
    };

    const handleSizeChange = (size) => {
        setSelectedSizes((prev) => {
            if (prev.find((s) => s.size === size)) {
                return prev.filter((s) => s.size !== size);
            } else {
                return [...prev, { size, chest: '', len: '', sh: '', slv: '' }];
            }
        });
    };

    const handleFieldChange = (size, field, value) => {
        setSelectedSizes((prev) =>
            prev.map((s) => (s.size === size ? { ...s, [field]: value } : s))
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!type || selectedSizes.length === 0) {
            toast.error('Please enter a type and select at least one size.');
            return;
        }

        const incomplete = selectedSizes.find(
            (s) => !s.chest || !s.len || !s.sh || !s.slv
        );

        if (incomplete) {
            toast.error('Please fill all fields for all selected sizes.');
            return;
        }

        const loadingToast = toast.loading('Submitting size chart...');
        try {
            const token = await getToken();

            const responses = await Promise.all(
                selectedSizes.map((entry) =>
                    axios.post(
                        '/api/product/sizechart',
                        { type, ...entry },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                )
            );

            toast.dismiss(loadingToast);

            const allSuccess = responses.every((res) => res.data.success === true);

            if (allSuccess) {
                toast.success('Sizes added successfully!');
                setType('');
                setSelectedSizes([]);
            } else {
                const failed = responses.find((res) => !res.data.success);
                toast.error(failed?.data?.message || 'One or more entries failed.');
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMessage =
                err?.response?.data?.message || 'Something went wrong';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

              
                <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center">Add T-Shirt Sizes</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* T-Shirt Type */}
                        <div>
                            <label className="block mb-2 font-medium">T-Shirt Type</label>
                            <input
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="e.g. OVERSIZED, REGULAR FIT"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Size Checkboxes */}
                        <div>
                            <label className="block mb-3 font-medium">Select Sizes</label>
                            <div className="flex flex-wrap gap-4">
                                {sizes?.map((size) => (
                                    <label key={size} className="flex items-center gap-2 text-sm font-medium">
                                        <input
                                            type="checkbox"
                                            checked={selectedSizes.some((s) => s.size === size)}
                                            onChange={() => handleSizeChange(size)}
                                            className="accent-blue-600"
                                        />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Size Table */}

                        <div className=" rounded-md">
                            <table className="min-w-[580px] w-full text-sm border border-gray-300 dark:border-gray-700 table-fixed">
                                <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                                    <tr>
                                        <th className="p-2 text-left w-[80px]">Size</th>
                                        <th className="p-2 text-left w-[120px]">Chest</th>
                                        <th className="p-2 text-left w-[120px]">Length</th>
                                        <th className="p-2 text-left w-[120px]">Shoulder</th>
                                        <th className="p-2 text-left w-[120px]">Sleeve</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedSizes?.map((entry) => (
                                        <tr key={entry.size} className="border-t border-gray-700 bg-gray-900">
                                            <td className="p-2 font-medium">{entry.size}</td>
                                            {['chest', 'len', 'sh', 'slv'].map((field) => (
                                                <td key={field} className="p-2 w-[120px]">
                                                    <input
                                                        type="text"
                                                        value={entry[field] ?? ''}
                                                        onChange={(e) =>
                                                            handleFieldChange(entry.size, field, e.target.value)
                                                        }
                                                        placeholder="e.g. 16"
                                                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        required
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg font-semibold transition duration-200"
                        >
                            Add Sizes
                        </button>
                    </form>
                </div>


                <div className="w-full lg:w-[80%] max-h-[calc(100vh-100px)] overflow-y-auto scroll-smooth pr-2 transform-gpu"
                    style={{
                        willChange: 'transform',
                        contain: 'layout paint',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarGutter: 'stable',
                    }}
                >
                    <h3 className="text-3xl font-bold mb-4 text-center">Existing Size Chart</h3>

                    {sizechart?.map((entry, idx) => (
                        <div
                            key={idx}
                            className="mb-6 border border-gray-300 dark:border-gray-700 rounded-lg"
                        >
                            <h4 className="text-lg font-semibold bg-gray-200 dark:bg-gray-800 p-3 rounded-t">
                                {entry.type} T-Shirt
                            </h4>
                            <div className="w-full">
                                <table className="w-full text-sm table-auto">
                                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
                                        <tr>
                                            <th className="p-2 text-left">Size</th>
                                            <th className="p-2 text-left">Chest</th>
                                            <th className="p-2 text-left">Length</th>
                                            <th className="p-2 text-left">Shoulder</th>
                                            <th className="p-2 text-left">Sleeve</th>
                                            <th className="p-2 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(entry.sizes).map(([size, val]) => (
                                            <tr key={val.id} className="border-t dark:border-gray-700">
                                                <td className="p-2">{size}</td>
                                                <td className="p-2">{val.chest}</td>
                                                <td className="p-2">{val.len}</td>
                                                <td className="p-2">{val.sh}</td>
                                                <td className="p-2">{val.slv}</td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => handleChartDelete(val.id)}
                                                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                                        title="Delete"
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>

    );
};

export default Chartsize;
