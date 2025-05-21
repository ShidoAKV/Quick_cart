"use client";
import React, { useState, useRef, useEffect } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import Image from "next/image";
import { useSession} from "next-auth/react";
import { useAppContext } from "@/context/AppContext";
import { login,logout } from "@/lib/actions/auth";

const Navbar = () => {
  const { router } = useAppContext();
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative">
      
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />

     
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
        <Link href="/" className="hover:text-gray-900 transition">About Us</Link>
        <Link href="/" className="hover:text-gray-900 transition">Contact</Link>
      </div>

      {/* Right side profile or login */}
      <div className="relative" ref={dropdownRef}>
        {status === "loading" ? (
          <p className="text-sm">Loading...</p>
        ) : session?.user ? (
          <div>
            <img
              src={session.user.image || "/default-user.png"}
              alt="User"
              width={36}
              height={36}
              className="rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md border rounded-md py-2 z-10">
                <p className="px-4 py-2 text-sm text-gray-700">
                  {session.user.name}
                </p>
                 <button
                  onClick={() =>router.push('/cart')}
                  className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                >
                  Cart
                </button>
                 <button
                  onClick={()=>router.push('/profile')}
                  className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => logout()}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => login()}
            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded"
          >
            Sign In with GitHub
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
