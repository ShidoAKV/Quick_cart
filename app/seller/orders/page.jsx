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

  const cancelOrder = async (orderId) => {
    try {
      setCancellingId(orderId);
      const token = await getToken();
      const { data } = await axios.post('/api/order/seller-orders/cancel', { orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success("Order cancelled successfully");
        fetchSellerOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancellingId(null);
    }
  };

  const refundOrder = async (PaymentId) => {
    try {
      setRefundingId(PaymentId);
      const token = await getToken();
      const { data } = await axios.post('/api/order/seller-orders/refund', { PaymentId }, {
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
          <h2 className="text-2xl font-semibold mb-5">Seller Dashboard</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            <div className="bg-gray-100 p-4 rounded text-center">
              <h3 className="font-semibold">Total Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <h3 className="font-semibold">Total Amount</h3>
              <p>{currency}{Number(stats.totalAmount).toFixed(2)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <h3 className="font-semibold">Total Refunds</h3>
              <p>{currency}{Number(stats.totalRefunds).toFixed(2)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <h3 className="font-semibold">Pending Refunds</h3>
              <p>{currency}{Number(stats.pendingRefunds).toFixed(2)}</p>
            </div>
          </div>

          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-8 font-semibold border-b border-gray-300 p-5">
            <div>Order Details</div>
            <div>Address</div>
            <div className="text-center">Items/color/ProductName</div>
            <div className="text-right">Amount/</div>
            <div>Payment Method</div>
            <div>Payment Status</div>
            <div>Refund Status</div>
            <div>Actions</div>
          </div>

    
          {orders?.map((order, index) => (
            <div
              key={index}
              className="border-t border-gray-300 p-5 bg-white rounded-md shadow-sm
                md:grid md:grid-cols-8 md:items-center md:gap-2 mb-4"
            >
              {/* MOBILE VIEW: stacked */}
              <div className="md:hidden space-y-1">
                <div className="flex items-center gap-3">
                  <Image
                    className="w-16 h-16 object-cover rounded"
                    src={assets.box_icon}
                    alt="box_icon"
                    width={64}
                    height={64}
                  />
                  <p className="font-medium truncate bg-black rounded-sm text-white flex flex-wrap">
                    {order?.items.map(item => `${item.product.name} x${item.quantity},,${item.color}`).join(", ")}
                  </p>
                </div>

                <p><strong>Address:</strong> {order.address.fullName}, {order.address.area}, {order.address.city}, {order.address.state}, {order.address.phoneNumber}</p>

                <p><strong>Amount:</strong> {currency}{order.amount.toFixed(2)}</p>

                <p><strong>PaymentMethod:</strong> Online</p>

                <p><strong>Payment Status:</strong> {order.payment ? "Paid" : "Pending"}</p>

                <p><strong>Refund Status:</strong> {order.cancelled ? (order.refunded ? "Refunded" : "Pending Refund") : "N/A"}</p>

                <p><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Order Time:</strong> {order.date ? new Date(order.date).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                }) : 'No time found'}</p>

                <p><strong>Status:</strong> {order.status}</p>
                

                <div className="flex flex-wrap gap-2 mt-2">
                  {!order.cancelled && !order.isCompleted && (
                    <button
                      disabled={cancellingId === order.orderId}
                      onClick={() => cancelOrder(order.orderId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      {cancellingId === order.orderId ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}

                  {order.cancelled && order.payment && !order.refunded && (
                    <button
                      disabled={refundingId !== null}
                      onClick={() => refundOrder(order.PaymentId)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      {refundingId !== null ? "Refunding..." : "Refund"}
                    </button>
                  )}

                  {order.cancelled && order.payment && order.refunded && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                      disabled
                    >
                      Refunded
                    </button>
                  )}

                  {!order.cancelled && order.isCompleted && (
                    <span className="text-gray-500 italic">Completed</span>
                  )}
                </div>
              </div>

              {/* DESKTOP VIEW: grid columns */}
              <div className="hidden md:flex items-center gap-4">
                <Image
                  className="w-16 h-16 object-cover rounded"
                  src={assets.box_icon}
                  alt="box_icon"
                  width={64}
                  height={64}
                />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 mt-1">
                    <span><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}</span><br />
                    <span><strong>Time:</strong> {order.date ? new Date(order.date).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }) : 'No time found'}</span><br />
                    <span><strong>Status:</strong> {order.status}</span>
                  </p>
                </div>
              </div>

              <div className="hidden md:block text-sm">
                <p>
                  <strong>{order.address.fullName}</strong><br />
                  {order.address.area}<br />
                  {order.address.city}, {order.address.state}<br />
                  {order.address.phoneNumber}
                </p>
              </div>

              <div className="hidden md:flex justify-center font-medium">
                    {order?.items.map(item => `${item.product.name},${item.quantity},${item.color}`).join(", ")}
              </div>

              <div className="hidden md:flex justify-end font-medium whitespace-nowrap">
                {order.amount.toFixed(2)}₹
              </div>

              <div className="hidden md:block">
                Online
              </div>

              <div className="hidden md:block">
                {order.payment ? "Paid" : "Pending"}
              </div>

              <div className="hidden md:block">
                {order.cancelled
                  ? order.refunded ? "Refunded" : "Pending Refund"
                  : "N/A"}
              </div>

              <div className="hidden md:flex flex-col gap-2 items-center">
                {!order.cancelled && !order.isCompleted && (
                  <button
                    disabled={cancellingId === order.orderId}
                    onClick={() => cancelOrder(order.orderId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {cancellingId === order.orderId ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}

                {order.cancelled && order.payment && !order.refunded && (
                  <button
                    disabled={refundingId !== null}
                    onClick={() => refundOrder(order.PaymentId)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {refundingId !== null ? "Refunding..." : "Refund"}
                  </button>
                )}

                {order.cancelled && order.payment && order.refunded && (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                    disabled
                  >
                    Refunded
                  </button>
                )}

                {!order.cancelled && order.isCompleted && (
                  <span className="text-gray-500 italic">Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
