'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";
import { BadgeCheck, CheckCircle, RefreshCcw, Info, X } from "lucide-react";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    totalRefunds: 0,
    pendingRefunds: 0,
  });
  const [refundData, setRefundData] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);


  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get('/api/order/seller-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {

        setOrders(data.orders);
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

  const refundOrder = async (PaymentId, email) => {
    try {

      setRefundingId(PaymentId);
      const token = await getToken();
      const { data } = await axios.post('/api/order/seller-orders/refund', { PaymentId, email }, {
        headers: { Authorization: `Bearer ${token}` }
      });

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
      toast.loading('processing...');
      const token = await getToken();
      const { data } = await axios.post('/api/order/seller-orders/refundaction', { action: e.target.value, id },
        { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        toast.dismiss();
        toast.success(data.message);
      } else {
        toast.dismiss();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchrefundinformation = async (orderId) => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/order/refund`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { orderId },
      });
      if (data.success) {
        setRefundData(data.refunddata);
        const foundOrder = orders?.find(o => o.id === orderId);
        setSelectedOrder(foundOrder);
        setShowRefundModal(true);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
      fetchrefundinformation();
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
                    <div className="lg:text-lg font-semibold text-blue-700 whitespace-nowrap mt-2 md:mt-0">
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
                            <p className="font-medium"><strong>{item.color}</strong> | <strong>{item.size}</strong> | Qty:<strong>{item.quantity}</strong></p>
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

                    <div className="md:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-md p-4 shadow-sm bg-white">
                      {/* Refund Status */}
                      <div className="flex-1">
                        <p className="font-medium text-black mb-1">Refund</p>
                        <p className={`uppercase font-medium flex items-center gap-1 ${order.claimedRefund ? 'text-yellow-700' : 'text-gray-500'}`}>
                          <Info className="w-4 h-4" />
                          {order.claimedRefund ? "REFUND CLAIMED" : "N/A"}
                        </p>

                        {order.claimedRefund && (
                          <select
                            className="mt-2 text-xs border px-2 py-1 rounded"
                            onChange={(e) => refundaction(e, order.id)}
                            defaultValue=""
                          >
                            <option value="" disabled>Select Action</option>
                            <option value="APPROVE">APPROVE</option>
                            <option value="REJECT">REJECT</option>
                          </select>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 items-start md:items-end text-xs">
                        {order.claimedRefund && (
                          <button
                            className="bg-gray-200 text-blue-700 px-3 py-1 rounded hover:bg-gray-300 flex items-center gap-1"
                            onClick={() => fetchrefundinformation(order.id)}
                          >
                            <Info className="w-4 h-4" />
                            View Details
                          </button>
                        )}


                        {order.claimedRefund && !order.refunded && (
                          <button
                            onClick={() => refundOrder(order.PaymentId, refundData.email)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            <RefreshCcw className="w-4 h-4" />
                            {refundingId !== null ? "Refunding..." : "Refund"}
                          </button>
                        )}
                        {order.claimedRefund && order.refunded && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1">
                            <BadgeCheck className="w-4 h-4" />
                            Refunded
                          </span>
                        )}

                        {!order.claimedRefund && order.isCompleted && (
                          <span className="italic text-gray-500">Completed</span>
                        )}
                      </div>

                      {/* Refund Modal */}
                      {showRefundModal && refundData && (
                        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50">
                          <div className="bg-white rounded-lg p-5 w-[90%] max-w-md relative shadow-lg">
                            <button
                              className="absolute top-2 right-2 text-gray-500 hover:text-black"
                              onClick={() => setShowRefundModal(false)}
                            >
                              <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Info className="w-5 h-5 text-blue-600" />
                              Refund Details
                            </h2>

                            {/* User Info */}
                            <div className="mb-3">
                              <h3 className="font-semibold text-gray-700 mb-1">User Information</h3>
                              <p><strong>Name:</strong> {refundData.name}</p>
                              <p><strong>Email:</strong> {refundData.email}</p>
                            </div>

                            {/* Refund Reason */}
                            <div className="mb-3">
                              <h3 className="font-semibold text-gray-700 mb-1">Refund Reason</h3>
                              <p>{refundData.reason}</p>
                            </div>

                            {/* Proof Photo */}
                            {refundData.photoUrl && (
                              <div className="mb-3">
                                <h3 className="font-semibold text-gray-700 mb-1">Proof of Refund Request</h3>
                                <img
                                  src={refundData.photoUrl}
                                  alt="Refund Proof"
                                  className="w-full max-h-64 object-contain mt-2 rounded border"
                                />
                              </div>
                            )}

                            {/* Payment Status */}
                            <div className="space-y-2">
                              <h3 className="font-semibold text-gray-700">Payment Status</h3>
                              {(selectedOrder?.refundFeePaid) ? (
                                <p className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />

                                  Payment Received
                                </p>
                              ) : (
                                <p className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1">
                                  <X className="w-4 h-4" />
                                  Payment Not Received
                                </p>
                              )}


                            </div>
                          </div>
                        </div>
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
