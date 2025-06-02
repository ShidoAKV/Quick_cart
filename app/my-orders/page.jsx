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
        //     RAZORPAY_KEY_ID="rzp_test_nxSF77arxy9gvB"
        if (typeof window === 'undefined' || !window.Razorpay) {
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

                    const { data } = await axios.post('/api/order/verify', response, { headers: `Bearer ${token}` })

                    if (data.success) {
                        fetchOrders();
                        router.push('/my-orders')
                    } else {
                        toast.error(data.message);
                    }

                } catch (error) {
                    toast.error(error.message);
                }

            }
        }
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
                toast.success("Payment initiats");
                initPay(data.order);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.dismiss();
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
            const { data } = await axios.post(`/api/user/ordercancel/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.dismiss();
            if (data.success) {
                toast.success(data.message);
                fetchOrders()
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
  
    useEffect(() => {
        if (user) fetchOrders();
    }, [user]);
 
    
   
    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-start px-4 md:px-16 lg:px-32 pt-2 pb-6 min-h-screen bg-gray-50">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 mt-2">My Orders</h2>

                {loading ? (
                    <Loading />
                ) : (
                    <div className="overflow-x-auto">
                        <div className="min-w-[700px] max-w-full border border-gray-300 rounded-md bg-white shadow-sm">
                            {orders.length === 0 ? (
                                <p className="p-6 text-center text-gray-600">No orders found.</p>
                            ) :
                                (
                                  orders?.map((order, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col md:flex-row justify-between gap-5 p-5 border-b border-gray-300"
                                        >
                                           
                                            <div className="flex flex-col gap-2 max-w-[300px]">
                                                <div className="flex gap-1 flex-wrap">
                                                    <Image
                                                     src={assets.box_icon}   
                                                     alt='items image'                           
                                                    />
                                                </div>
                                                <div className="text-sm text-gray-800 font-medium">
                                                    {order?.items.map(
                                                        (item) => `${item.product.name} x${item.quantity}`
                                                    ).join(", ")}
                                                </div>
                                                  <div className="text-sm text-gray-500">
                                                  <span className="font-semiibold text-black">{order.items[0].color},{order.items[0].size},{order.items.length}
                                                </span>
                                                 </div>
                                                
                                    
                                            </div>

                                            {/* Address Details */}
                                            <div className="flex-1 text-sm text-gray-700 space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Name:</span>
                                                    <span>{order.address.fullName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Area:</span>
                                                    <span>{order.address.area}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">City/State:</span>
                                                    <span>{`${order.address.city}, ${order.address.state}`}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Phone:</span>
                                                    <span>{order.address.phoneNumber}</span>
                                                </div>
                                            </div>

                                            {/* Amount and Payment Info */}
                                            <div className="flex-1 text-sm text-gray-700 space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Amount:</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {currency}{order.amount.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Payment Method:</span>
                                                    <span>{order.paymentmode || "Online"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Date:</span>
                                                    <span>{new Date(order.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Status:</span>
                                                    <span
                                                        className={`font-semibold ${order.cancelled
                                                                ? "text-red-600"
                                                                : order.payment
                                                                    ? order.isCompleted
                                                                        ? "text-green-600"
                                                                        : "text-blue-600"
                                                                    : "text-yellow-600"
                                                            }`}
                                                    >
                                                        {order.cancelled
                                                            ? "Cancelled"
                                                            : order.payment
                                                                ? order.isCompleted
                                                                    ? "Completed"
                                                                    : "Paid"
                                                                : "Pending"}
                                                    </span>
                                                </div>

                                                {!order.cancelled && !order.payment && (
                                                    <div className="flex gap-2 pt-2 justify-end">
                                                        <button
                                                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                                                            onClick={() => handlePayment(order.orderId)}
                                                            disabled={processingOrderId === order.orderId}
                                                        >
                                                            Pay Now
                                                        </button>
                                                        <button
                                                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                                                            onClick={() => handleCancelOrder(order.orderId)}
                                                            disabled={processingOrderId === order.orderId}
                                                        >
                                                            Cancel Order
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))

                                )




                            }
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;
