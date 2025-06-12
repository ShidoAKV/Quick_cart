'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [refundingId, setRefundingId] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    totalRefunds: 0,
    pendingRefunds: 0,
  });
  const [refundData, setRefundData] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);


  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get('/api/order/seller-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setOrders(data.orders.reverse());
        setStats({
          totalOrders: data.totalOrders,
          totalAmount: data.totalAmount,
          totalRefunds: data.totalRefunds,
          pendingRefunds: data.pendingRefunds,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const cancelOrder = async (orderId) => {
  //   try {
  //     setCancellingId(orderId);
  //     const token = await getToken();
  //     const { data } = await axios.post('/api/order/seller-orders/cancel', { orderId }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     if (data.success) {
  //       toast.success("Order cancelled successfully");
  //       fetchSellerOrders();
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   } finally {
  //     setCancellingId(null);
  //   }
  // };

  const refundOrder = async (PaymentId) => {
    try {
      setRefundingId(PaymentId);
      const token = await getToken();
      const { data } = await axios.post('/api/order/seller-orders/refund', { PaymentId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(data);
      
      if (data.success) {
        toast.success("Refund issued successfully");
        fetchSellerOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRefundingId(null);
    }
  };

  const refundaction = async (e, id) => {

    try {
      const token = await getToken();
      const { data } = await axios.post('/api/order/seller-orders/refundaction', { action: e.target.value, id },
        { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const fetchrefundinformation=async(orderId)=>{
     try {
           const token = await getToken();
            const { data } = await axios.get(`/api/order/refund`, {
                headers: { Authorization: `Bearer ${token}` },
                params:{orderId}
            });
            if(data.success){
              setRefundData(data.refunddata);
              setShowRefundModal(true);
            }
     } catch (error) {
         toast.error(error.message)
     }
  }
  

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);



  return (
    <div className="flex-1 h-screen overflow-auto flex flex-col justify-between text-sm bg-gray-50">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-8">
          <h2 className="text-2xl font-bold mb-5 uppercase">Seller Dashboard</h2>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {[
              { label: "Total Orders", value: stats.totalOrders },
              { label: "Total Amount", value: `${currency}${Number(stats.totalAmount).toFixed(2)}` },
              { label: "Total Refunds", value: `${currency}${Number(stats.totalRefunds).toFixed(2)}` },
              { label: "Pending Refunds", value: `${currency}${Number(stats.pendingRefunds).toFixed(2)}` },
            ].map((stat, idx) => (
              <div key={idx} className="bg-gray-100 p-4 rounded text-center shadow-sm">
                <h3 className="font-semibold uppercase">{stat.label}</h3>
                <p className="mt-1 text-lg font-medium">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {orders?.map((order, index) => (
              order.payment && (
                <div key={index} className="border rounded-md p-3 shadow-sm bg-white">

                  {/* Order Info */}
                  <div className="md:flex md:justify-between md:items-center text-xs text-gray-700 mb-2">
                    <div className="flex flex-wrap gap-4">
                      <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {new Date(order.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                    </div>
                    <div className="font-semibold text-blue-700 whitespace-nowrap mt-2 md:mt-0">
                      ₹{order.amount.toFixed(2)}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col md:flex-wrap md:flex-row gap-3 mb-3">
                    {order?.items?.map((item, idx) => {
                      const imageUrl = item.product?.colorImageMap?.[item.color]?.[0] || assets.box_icon;

                      return (
                        <div
                          key={idx}
                          className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.5rem)] border rounded p-2 bg-gray-50 flex items-center gap-2"
                        >
                          <Image
                            src={imageUrl}
                            alt="product"
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="text-xs space-y-0.5">
                            <p><strong>{item.product.name}</strong></p>
                            <p>Color: {item.color} | Qty: {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Address, Payment, Refund, Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-gray-700">
                    <div>
                      <p className="font-medium text-black mb-1">Address</p>
                      <p>{order.address.fullName}</p>
                      <p>{order.address.area}, {order.address.city}</p>
                      <p>{order.address.state} - {order.address.phoneNumber}</p>
                    </div>

                    <div>
                      <p className="font-medium text-black mb-1">Payment</p>
                      <p>Method: Online</p>
                      <p>Status: {order.payment ? "PAID" : "PENDING"}</p>
                    </div>

                    <div>
                      <p className="font-medium text-black mb-1">Refund</p>
                      <p className={`uppercase font-medium ${order.claimedRefund ? 'text-yellow-700' : 'text-gray-500'}`}>
                        {order.claimedRefund ? "REFUND CLAIMED" : "N/A"}
                      </p>

                      {order.claimedRefund && (
                        <select
                          className="mt-1 text-xs border bg-white px-1.5 py-0.5 rounded"
                          onChange={(e) => refundaction(e, order.id)}
                          defaultValue=""
                        >
                          <option value="" disabled>Select Action</option>
                          <option value="APPROVE">APPROVE</option>
                          <option value="REJECT">REJECT</option>
                        </select>
                      )}
                    </div>
                    {showRefundModal && refundData && (
                      <div className="fixed inset-0 backdrop-blur-lg bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-4 w-[90%] max-w-md space-y-3 relative">
                          <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                            onClick={() => setShowRefundModal(false)}
                          >
                            ✖
                          </button>

                          <h2 className="text-lg font-semibold mb-2">Refund Details</h2>
                          <p><strong>Name:</strong> {refundData.name}</p>
                          <p><strong>Email:</strong> {refundData.email}</p>
                          <p><strong>Reason:</strong> {refundData.reason}</p>
                          {refundData.photoUrl && (
                            <img
                              src={refundData.photoUrl}
                              alt="Refund Proof"
                              className="w-full max-h-64 object-contain rounded border"
                            />
                          )}
                        </div>
                      </div>
                    )}


                    <div className="flex flex-col gap-1 items-start md:items-center justify-center">
                      {order.claimedRefund && (
                        <button
                          className="bg-gray-200 text-blue-700 px-2 py-0.5 rounded text-xs hover:bg-gray-300"
                          onClick={() => {fetchrefundinformation(order.id)}}
                        >
                          View Document
                        </button>
                      )}

                      {order.claimedRefund && !order.refunded && (
                        <button
                          disabled={refundingId !== null}
                          onClick={() => refundOrder(order.PaymentId)}
                          className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                        >
                          {refundingId !== null ? "Refunding..." : "Refund"}
                        </button>
                      )}

                      {order.claimedRefund && order.refunded && (
                        <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">Refunded</span>
                      )}

                      {!order.claimedRefund && order.isCompleted && (
                        <span className="italic text-gray-500 text-xs">Completed</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>

        </div>

      )}
      <Footer />
    </div>
  );
};

export default Orders;
