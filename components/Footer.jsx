import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row justify-between gap-10 flex-wrap ">
        {/* Logo + Description */}
        <div className="w-full lg:w-[22%]">
          <span className="text-4xl text-green-800">
            P<span className="text-black">illey</span>
          </span>
          <p className="text-sm leading-relaxed">
            Elevate your wardrobe with our curated selection of premium apparel,
            blending style and comfort for the modern lifestyle.
          </p>
        </div>

        {/* Company Links */}
        <div className="w-full sm:w-[45%] lg:w-[18%]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/infopage"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/infopage"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/infopage"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="w-full sm:w-[45%] lg:w-[18%]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/infopage"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                FAQs
              </a>
            </li>
            <li>
              <a
                href="/infopage"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                Shipping
              </a>
            </li>
            <li>
              <a
                href="/infopage"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                Returns
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="w-full lg:w-[28%]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Get in Touch</h3>
          <ul className="text-sm space-y-3">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="w-4 h-4 text-black" />
              +91 9266686822
            </li>
            <li className="flex items-center gap-2">
              <HiOutlineMail className="w-5 h-5 text-black" />
              thakurenterprises2115@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="w-4 h-4 text-black" />
              New Delhi, India
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-200 py-4 text-center text-xs sm:text-sm">
        © 2025 Pilley.in. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
