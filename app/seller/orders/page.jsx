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

  const fetchSellerOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get('/api/order/seller-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setOrders(data.orders.reverse());
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setCancellingId(orderId);
      const token = await getToken();
      console.log(orderId);
      
      const { data } = await axios.post('/api/order/seller-orders/cancel', { orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(data);
      
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

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? <Loading /> : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Orders</h2>
          <div className="max-w-4xl rounded-md">
            <div className="hidden md:flex font-semibold border-b border-gray-300 p-5">
              <div className="flex-1 max-w-80">Order Details</div>
              <div className="w-48">Address</div>
              <div className="w-24">Amount</div>
              <div className="w-48">Info</div>
               <div className="w-48">payment status</div>
              <div className="w-24">Actions</div>
            </div>
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300 items-center"
              >
                <div className="flex-1 flex gap-5 max-w-80">
                  <Image
                    className="max-w-16 max-h-16 object-cover"
                    src={assets.box_icon}
                    alt="box_icon"
                  />
                  <p className="flex flex-col gap-3">
                    <span className="font-medium">
                      {order.items.map(item => item.product.name + ` x ${item.quantity}`).join(", ")}
                    </span>
                    <span>Items: {order.items.length}</span>
                  </p>
                </div>
                <div className="w-48">
                  <p>
                    <span className="font-medium">{order.address.fullName}</span><br />
                    <span>{order.address.area}</span><br />
                    <span>{`${order.address.city}, ${order.address.state}`}</span><br />
                    <span>{order.address.phoneNumber}</span>
                  </p>
                </div>
                <p className="w-24 font-medium my-auto">{currency}{order.amount}</p>
                <div className="w-48">
                  <p className="flex flex-col">
                    <span>Method: COD</span>
                    <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                    <span>Status: {order.status}</span>
                  </p>
                </div>
                <div>
                    <span>Payment: {order.payment ? "Paid" : "Pending"}</span>
                </div>
                <div className="w-24 flex justify-center items-center">
                  {!order.cancelled && !order.isCompleted ? (
                    <button
                      disabled={cancellingId === order.orderId}
                      onClick={() =>cancelOrder(order.orderId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      {cancellingId === order.orderId ? "Cancelling..." : "Cancel Order"}
                    </button>
                  ) : (
                    <span className="text-gray-500 italic">No actions</span>
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
