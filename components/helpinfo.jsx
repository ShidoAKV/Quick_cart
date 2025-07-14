'use client';

import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';

const Helpinfo = () => {
    const [email, setEmail] = useState('');
    const [helpReason, setHelpReason] = useState('');
    const [reasoncontent, setReasoncontent] = useState('')
    const [showRefundSection, setShowRefundSection] = useState(false);
    const [faqOpen, setFaqOpen] = useState(null);
    const [loading, setLoading] = useState(false);
    const { getToken } = useAppContext();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');


    const helpOptions = [
        'Want refund',
        'Other',
    ];

    const faqData = [
        {
            question: 'How long does a refund take?',
            answer: 'Refunds usually take 5-7 business days to reflect in your account.',
        },
        {
            question: 'Can I change my shipping address?',
            answer: 'Unfortunately, once an order is placed, the shipping address cannot be changed.',
        },
        {
            question: 'Do you offer COD (Cash on Delivery)?',
            answer: 'No, we currently accept only prepaid orders through UPI, Cards, and Net Banking.',
        },
    ];

    const sendRefundLink = async (e) => {
        e.preventDefault();
        if (!email || !helpReason) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            setLoading(true);
            const token = await getToken();
            const { data } = await axios.post('/api/help/send/', {
                email,
                orderId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                toast.success(data.message);
                setEmail('');
                setHelpReason('');
                setReasoncontent('');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Internal server error');
        } finally {
            setLoading(false);
        }
    };


    const handleReasonChange = (e) => {
        setHelpReason(e.target.value);
        setReasoncontent(e.target.value)
        setShowRefundSection(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-6 md:px-20">
            <div className="max-w-2xl mx-auto bg-gray-800 shadow-2xl rounded-2xl p-8 space-y-8">
                <div className="flex items-center gap-3">
                    <HelpCircle className="text-blue-400 w-7 h-7" />
                    <h1 className="text-3xl font-bold">Refund & Support</h1>
                </div>

                <form onSubmit={sendRefundLink} className="space-y-6">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Your Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Reason</label>
                        <input
                            type="reason"
                            value={reasoncontent}
                            onChange={(e) => setReasoncontent(e.target.value)}
                            required
                            placeholder=" query...."
                            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>


                    <div>
                        <label className="block mb-1 text-sm font-medium">Why do you need help?</label>
                        <select
                            value={helpReason}
                            onChange={handleReasonChange}
                            required
                            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>Select a reason</option>
                            {helpOptions?.map((reason, idx) => (
                                <option key={idx} value={reason}>{reason}</option>
                            ))}
                        </select>
                    </div>

                    {showRefundSection && (
                        <div className="bg-gray-700 p-4 rounded-md">
                            <h3 className="text-xl font-semibold mb-2 text-blue-400">Refund Request</h3>
                            <p className="text-sm mb-3 text-gray-300">
                                By clicking below, a refund verification link will be sent to the user’s email.
                            </p>
                            {loading ? (
                                <div className="flex justify-center py-4">
                                    <LoaderCircle className="h-8 w-8 text-blue-400 animate-spin" />
                                </div>

                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 w-full py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    Send Refund Link
                                </button>
                            )}

                        </div>
                    )}
                </form>

                <div className="border-t border-gray-600 pt-6">
                    <h2 className="text-2xl font-semibold text-blue-300 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqData?.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-gray-700 rounded-md px-4 py-3 cursor-pointer"
                                onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                            >
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium">{faq.question}</h4>
                                    <ChevronDown
                                        className={`transform transition-transform duration-300 ${faqOpen === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </div>
                                {faqOpen === index && (
                                    <p className="mt-2 text-sm text-gray-300">{faq.answer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Helpinfo;
