import { Roboto } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import { Suspense } from "react";
import Loadingcomponent from "./loading";
import Navbar from "@/components/Navbar";

const outfit = Roboto({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Pilley",
  description: "Ecommerce T-shirt Site ",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`}  >
          <Toaster />
          <AppContextProvider>
             <Navbar/>
             <Suspense fallback={<Loadingcomponent/>} >{children}</Suspense>
            <Script
              src="https://checkout.razorpay.com/v1/checkout.js"
              strategy="afterInteractive"
            />
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}