"use client";

import { useSession } from "next-auth/react";
import React from "react";

const Profile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center py-10 text-gray-600">Loading...</p>;
  }

  if (!session) {
    return (
      <p className="text-center py-10 text-red-500">
        You are not logged in. Please sign in to view your profile.
      </p>
    );
  }

  // Simulated values for wishlist and orders count (replace with real values from DB if available)
  const ordersCount = 5;
  const wishlistCount = 3;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
        {/* Profile Image */}
        <img
          src={session.user.image || "/default-user.png"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
        />

        {/* User Details */}
        <div className="flex-1">
          <h3 className="text-xl font-bold">{session.user.name}</h3>
          <p className="text-gray-600">{session.user.email}</p>
          <p className="text-gray-600 mt-2">
            <strong>Address:</strong> Not Provided
          </p>

          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold">{ordersCount}</p>
              <p className="text-sm text-gray-500">Orders</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{wishlistCount}</p>
              <p className="text-sm text-gray-500">Wishlist</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Orders
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
              Edit Profile
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
