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
                headers: { Authorization: ` Bearer ${token} ` }
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

                    const { data } = await axios.post('/api/order/verify', response, { headers:{Authorization: `Bearer ${token}` }})
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
                console.log(data);
                toast.success("Payment initiats");
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
            const { data } = await axios.post(`/api/user/ordercancel/${orderId}`, {
                headers: { Authorization: `Bearer ${token} ` }
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
            <div className="flex flex-col px-2 md:px-8 py-4 min-h-screen bg-gray-50">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold  mx-11 ">My Orders</h2>
                <div className="w-24 md:w-30 h-1 bg-green-800  rounded-full ml-10"></div>
                {loading ? (
                    <Loading />
                ) : (
                    <div className="overflow-x-auto mx-11 mt-5">
                        <div className="w-full   rounded-md bg-gray-200 shadow">

                            {orders.length === 0 ? (
                                <p className="p-6 text-center text-gray-600">No orders found.</p>
                            ) : orders.map((order, index) => (
                                <div key={index} className="border-b p-4 sm:p-6 flex flex-col gap-4">


                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4  p-2 rounded">
                                                <Image src={assets.box_icon} alt="item" width={44} height={44} />
                                                <div className="text-sm">
                                                    <p className="font-semibold text-gray-800">{item.product.name} x{item.quantity}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        {item.color && <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">{item.color}</span>}
                                                        {item.size && <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">{item.size}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex  items-center">
                                                    <p className="text-xs sm:text-sm text-gray-700 ">{new Date(order.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}

                                    </div>




                                    <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700 ">
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

                                        {/* Action Buttons */}
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
                                                        className=" cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm rounded-md transition disabled:opacity-50"
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
            <Footer />
        </>
    );
};

export default MyOrders;
