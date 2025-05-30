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
    const { currency, getToken, user,router } = useAppContext();
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
                setOrders(data.orders.reverse());
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
          const token=await getToken();

           const { data } = await axios.post('/api/order/verify',response, { headers:`Bearer ${token}` })
         
          if (data.success) {
            fetchOrders();
            router.push('/my-orders')
          }else{   
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
            const { data } = await axios.post(`/api/order/payment`, {orderId}, {
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
            const { data } = await axios.put(`/api/order/cancel/${orderId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.dismiss();
            if (data.success) {
                toast.success("Order cancelled successfully");
                fetchOrders();
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
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {loading ? <Loading /> : (
                        <div className="max-w-5xl border-t border-gray-300 text-sm">
                            {orders?.map((order, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                    <div className="flex-1 flex gap-5 max-w-80">
                                        <Image
                                            className="max-w-16 max-h-16 object-cover"
                                            src={assets.box_icon}
                                            alt="box_icon"
                                        />
                                        <p className="flex flex-col gap-3">
                                            <span className="font-medium text-base">
                                                {order.items.map((item) =>
                                                    item.product.name + ` x ${item.quantity}`
                                                ).join(", ")}
                                            </span>
                                            <span>Items : {order.items.length}</span>
                                        </p>
                                    </div>

                                    <div>
                                        <p>
                                            <span className="font-medium">{order.address.fullName}</span><br />
                                            <span>{order.address.area}</span><br />
                                            <span>{`${order.address.city}, ${order.address.state}`}</span><br />
                                            <span>{order.address.phoneNumber}</span>
                                        </p>
                                    </div>

                                    <p className="font-medium my-auto">{currency}{order.amount}</p>

                                    <div className="flex flex-col gap-1 my-auto">
                                        <span>Method: {order.paymentmode || 'Online'}</span>
                                        <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                                        <span className={`font-semibold ${order.cancelled
                                            ? 'text-red-600'
                                            : order.payment
                                                ? (order.isCompleted ? 'text-green-600' : 'text-blue-600')
                                                : 'text-yellow-600'
                                            }`}>
                                            Status: {order.cancelled
                                                ? 'Cancelled'
                                                : order.payment
                                                    ? (order.isCompleted ? 'Completed' : 'Paid')
                                                    : 'Pending'}
                                        </span>

                                        {/* Show Pay Now and Cancel buttons only if not paid and not cancelled */}
                                        {!order.cancelled && !order.payment && (
                                            <div className="flex gap-2 mt-2">
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
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;
