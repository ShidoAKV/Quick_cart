'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const CommentOnProduct = ({ productId }) => {
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const { getToken } = useAppContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment || !rating || !productId) return;
        const payload = { comment, rating, productId };
        try {
             setLoading(true);
            const token = await getToken();
            const { data } = await axios.post('/api/product/comment/add', payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                },
            )
            if (data.success) {
                toast.success(data.message);
                setComment('');
                setRating(5);
                setShowModal(false);
               
            } else {
                toast.custom((t) => (
                    <div
                        className={`${t.visible ? 'animate-enter' : 'animate-leave'
                            } max-w-md w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 shadow-md rounded`}
                    >
                        <p className="text-sm font-medium">{data.message}</p>
                    </div>
                ));
            }

        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    return (
        <>
            <div className="text-center mt-8 mr-[30%] lg:mr-[56%]">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
                >
                    Comment & Rate Product
                </button>
            </div>

            <AnimatePresence>
                {showModal && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 h-screen bg-opacity-50 z-50 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            className="fixed z-50 top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl w-[90%] max-w-md"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Leave a Comment</h2>
                            <form onSubmit={handleSubmit} className=" space-y-3">
                                <textarea
                                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    rows={4}
                                    placeholder="Your comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                                <select
                                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5].map((val) => (
                                        <option key={val} value={val}>
                                            {val} Star{val > 1 && 's'}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex justify-between gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        disabled={loading}
                                    >
                                        {loading ? 'Submitting...' : 'Submit'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default CommentOnProduct;
