"use client";
import React, { useEffect, useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { HelpCircle } from "lucide-react";

const Navbar = () => {
  const { isSeller, router, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setCartCount(getCartCount());
  });
  
  const navVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
};

const linkHover = {
  whileHover: { scale: 1.05 },
  transition: { type: "spring", stiffness: 300 },
};

  const linkStyle = (path) =>
    `hover:text-black transition border-b-2 pb-1 ${
      pathname === path ? "border-black" : "border-transparent"
    }`;

  return (
    <nav className="flex items-center  justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 sticky top-0 z-50 lg:static lg:max-h-screen lg:overflow-y-auto bg-white">
      <Image
        className="cursor-pointer rounded-sm w-10 md:w-10 bg-gradient-to-r from-black to-green-800 p-0.5"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

      {/* Desktop Nav */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className={linkStyle("/")}>
          Home
        </Link>
        <Link href="/all-products" className={linkStyle("/all-products")}>
          Shop
        </Link>
        <Link href="/my-orders" className={linkStyle("/my-orders")}>
          My orders
        </Link>

        <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
          <Image src={assets.cart_icon} alt="cart" className="hover:brightness-110 transition" />
          {cartCount > 0 && (
            <span className="absolute -top-2 right-3 bg-green-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full cursor-pointer"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Desktop User Section */}
      <ul className="hidden md:flex items-center gap-4">
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="cart"
                labelIcon={<CartIcon />}
                onClick={() => router.push("/cart")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>

             <UserButton.MenuItems>
              <UserButton.Action
                label="Help"
                labelIcon={<HelpCircle/>}
                onClick={() => router.push("/Help")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            className="flex items-center gap-2 hover:text-gray-900 transition"
            onClick={openSignIn}
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </ul>

      {/* Mobile Nav */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}

        {!isSeller && (
          <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
            <Image
              src={assets.cart_icon}
              alt="cart"
              className="hover:brightness-110 transition"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 right-3 bg-green-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        )}

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Home"
                labelIcon={<HomeIcon />}
                onClick={() => router.push("/")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Products"
                labelIcon={<BoxIcon />}
                onClick={() => router.push("/all-products")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="cart"
                labelIcon={<CartIcon />}
                onClick={() => router.push("/cart")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>

            <UserButton.MenuItems>
              <UserButton.Action
                label="Help"
                labelIcon={<HelpCircle/>}
                onClick={() => router.push("/Help")}
              />
            </UserButton.MenuItems>
            
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
