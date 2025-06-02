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
  const { currency,getToken, user } = useAppContext();

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

      console.log(data.message);

      if (data.success) {
        setOrders(data.orders.reverse());
        setStats({
          totalOrders: data.totalOrders,
          totalAmount: data.totalAmount,
          totalRefunds: data.totalRefunds,
          pendingRefunds: data.pendingRefunds,
        })
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
      // console.log(PaymentId);
      
      setRefundingId(PaymentId);
       const token = await getToken();
      const { data } = await axios.post('/api/order/seller-orders/refund', {PaymentId }, {
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
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm bg-gray-50">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-8">
          <h2 className="text-2xl font-semibold mb-5">Seller Dashboard</h2>


          <div className="grid grid-cols-4 gap-4 p-4">
            <div className="bg-gray-100 p-4 rounded">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3>Total Amount</h3>
              <p>{Number(stats.totalAmount).toFixed(2)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3>Total Refunds</h3>
              <p>{Number(stats.totalRefunds).toFixed(2)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h3>Pending Refunds</h3>
              <p>{Number(stats.pendingRefunds).toFixed(2)}</p>
            </div>
          </div>



          <div className="rounded-md overflow-x-auto bg-white shadow">
            <div className="hidden md:grid grid-cols-6 font-semibold border-b border-gray-300 p-5">
              <div>Order Details</div>
              <div>Address</div>
              <div>Amount</div>
              <div>Info</div>
              <div>Payment Status</div>
              <div>Actions</div>
            </div>
            {orders?.map((order, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-6  p-5 border-t border-gray-300 items-center"
              >
                <div className="flex gap-5">
                  <Image
                    className="w-16 h-16 object-cover"
                    src={assets.box_icon}
                    alt="box_icon"
                    width={64}
                    height={64}
                  />
                  <div>
                    <p className="font-medium">
                      {order.items.map(item => item.product.name + ` x ${item.quantity}`).join(", ")}
                    </p>
                    <p>Items: {order.items.length}</p>
                  </div>
                </div>

                <div>
                  <p>
                    <span className="font-medium">{order.address.fullName}</span><br />
                    <span>{order.address.area}</span><br />
                    <span>{`${order.address.city}, ${order.address.state}`}</span><br />
                    <span>{order.address.phoneNumber}</span>
                  </p>
                </div>

                <p className="font-medium">{currency}{order.amount}</p>
                <div>
                  <p className="flex flex-col">
                    <span>Method:Online</span>
                    <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                    <span>Status: {order.status}</span>
                  </p>
                </div>

                <div>
                  <span>{order.payment ? "Paid" : "Pending"}</span>
                </div>

                <div className="flex flex-col gap-2 items-center">
                  {!order.cancelled && !order.isCompleted && (
                    <button
                      disabled={cancellingId === order.orderId}
                      onClick={() => cancelOrder(order.orderId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      {cancellingId === order.orderId ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                  
                  {order.cancelled && order.payment &&!order.refunded&&(
                    <button
                      disabled={refundingId !== null}
                      onClick={() => refundOrder(order.PaymentId)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      { refundingId !== null? "Refunding..." : "Refund"}
                    </button>
                  )}
                  {order.cancelled && order.payment &&order.refunded&&(
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
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
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;
