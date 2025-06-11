'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const MyOrders = () => {
    const { currency, getToken, user, router } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingOrderId, setProcessingOrderId] = useState(null);
    const [selectedRefund, setSelectedRefund] = useState(null);
    const [showRefundModal, setShowRefundModal] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/order/list', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const initPay = (order) => {
        if (!window.Razorpay) {
            toast.error('Razorpay is not available');
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            name: 'Product Payment',
            description: 'Product payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const token = await getToken();
                    const { data } = await axios.post('/api/order/verify', response, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (data.success) {
                        fetchOrders();
                        router.push('/my-orders');
                    } else {
                        toast.error(data.message);
                    }
                } catch (error) {
                    toast.error(error.message);
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handlePayment = async (orderId) => {
        try {
            setProcessingOrderId(orderId);
            toast.loading("Processing payment...");
            const token = await getToken();
            const { data } = await axios.post(`/api/order/payment`, { orderId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.dismiss();
            if (data.success) {
                toast.success("Payment initiated");
                initPay(data.order);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Payment Failed: " + error.message);
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            setProcessingOrderId(orderId);
            toast.loading("Cancelling order...");
            const token = await getToken();
            const { data } = await axios.post(`/api/user/ordercancel/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.dismiss();
            if (data.success) {
                toast.success(data.message);
                fetchOrders();
                router.push('/my-orders');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to cancel order: " + error.message);
        } finally {
            setProcessingOrderId(null);
        }
    };

    const fetchRefundStatus = async(orderId) => {
        try {
            const token = await getToken();
           
            const { data } = await axios.get(`/api/order/refund`, {
                headers: { Authorization: `Bearer ${token}` },
                params:{orderId}
            });
            console.log(data);
            
            if (data.success) {
                setSelectedRefund(data.refunddata);
                setShowRefundModal(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Refund status error: " + error.message);
        }
    };

    const claimRefundPayment = async (orderId) => {
        try {
            toast.loading("Processing refund payment...");
            const token = await getToken();
            const { data } = await axios.post(`/api/refund/payment`, { orderId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.dismiss();
            if (data.success) {
                toast.success("Refund payment successful");
                setShowRefundModal(false);
                fetchOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Refund payment error: " + error.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    return (
        <>
            <div className="flex flex-col px-2 md:px-8 py-4 min-h-screen bg-gray-50">
                <h2 className="text-lg sm:text-xl md:text-2xl mx-11 text-black">My Orders</h2>

                {loading ? (
                    <Loading />
                ) : (
                    <div className="overflow-x-auto mx-11 mt-5">
                        <div className="w-full rounded-md bg-gray-200 shadow">
                            {orders.length === 0 ? (
                                <p className="p-6 text-center text-gray-600">No orders found.</p>
                            ) : orders?.map((order, index) => (
                                <div key={index} className="border-b p-2 sm:p-6 flex flex-col gap-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 p-2 rounded">
                                                <Image src={assets.box_icon} alt="item" width={44} height={44} />
                                                <div className="text-sm">
                                                    <p className="font-semibold text-gray-800">{item.product.name} x{item.quantity}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        {item.color && <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">{item.color}</span>}
                                                        {item.size && <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">{item.size}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="text-xs sm:text-sm text-gray-700">{new Date(order.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid sm:grid-cols-4 gap-4 text-sm text-gray-700">
                                        <div>
                                            <p><strong>Name:</strong> {order.address.fullName}</p>
                                            <p><strong>Area:</strong> {order.address.area}</p>
                                            <p><strong>City/State:</strong> {order.address.city}, {order.address.state}</p>
                                            <p><strong>Phone:</strong> {order.address.phoneNumber}</p>
                                        </div>
                                        <div>
                                            <p><strong>Amount:</strong> ₹{order.amount.toFixed(2)} {currency}</p>
                                            <p><strong>Status:</strong> <span className={`font-semibold ${order.cancelled ? 'text-red-600' : order.payment ? order.isCompleted ? 'text-green-600' : 'text-blue-600' : 'text-yellow-600'}`}>
                                                {order.cancelled ? "Cancelled" : order.payment ? order.isCompleted ? "Completed" : "Paid" : "Pending"}
                                            </span></p>
                                        </div>
                                        <div className="flex justify-end h-8 gap-2">
                                            {order.payment && !order.refunded && (
                                                <>
                                                    <button
                                                        className="text-sm px-4 rounded bg-blue-900 text-white hover:bg-blue-950"
                                                        onClick={() => window.open(`/refundpage/?id=${order.orderId}`)}
                                                    >
                                                        Claim Refund
                                                    </button>
                                                    <button
                                                        className="text-sm px-4 rounded bg-gray-800 text-white hover:bg-gray-900"
                                                        onClick={() => fetchRefundStatus(order.id)}
                                                    >
                                                        Check Refund Status
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex gap-2 items-start sm:items-center justify-start sm:justify-end">
                                            {!order.cancelled && !order.payment && (
                                                <>
                                                    <button
                                                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md transition disabled:opacity-50"
                                                        onClick={() => handlePayment(order.orderId)}
                                                        disabled={processingOrderId === order.orderId}
                                                    >
                                                        Pay Now
                                                    </button>
                                                    <button
                                                        className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-md transition disabled:opacity-50"
                                                        onClick={() => handleCancelOrder(order.orderId)}
                                                        disabled={processingOrderId === order.orderId}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showRefundModal && selectedRefund && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Refund Details</h2>
                        <p><strong>Status:</strong> {selectedRefund.status}</p>
                        <p><strong>Reason:</strong> {selectedRefund.reason}</p>
                        <p><strong>Requested On:</strong> {new Date(selectedRefund.createdAt).toLocaleDateString()}</p>
                        {selectedRefund.status === "PENDING" && (
                            <p className="mt-2 text-yellow-600">Waiting for seller approval.</p>
                        )}
                        {selectedRefund.status === "APPROVED" && (
                            <button
                                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                onClick={() => claimRefundPayment(selectedRefund.orderId)}
                            >
                                Claim Refund Payment
                            </button>
                        )}
                        <button
                            className="mt-4 ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            onClick={() => setShowRefundModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default MyOrders;
