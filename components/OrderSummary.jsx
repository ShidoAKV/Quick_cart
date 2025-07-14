import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cartItems,
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const payloadRef = useRef(null);

  const fetchUserAddresses = async () => {
    setIsAddressLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/address/get-address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsAddressLoading(false);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    if (!selectedAddress) {
      return toast.error("Please select an address");
    }
    if (isPlacingOrder) {
      return toast.error("Previous order is processing...");
    }

    try {
      let cartItemArray = Object.entries(cartItems).map(([key, quantity]) => {
        const [product, size, color] = key.split("|");
        return { product, size, color, quantity };
      });

      if (cartItemArray.length === 0) {
        return toast.error("Cart is empty");
      }

      setIsPlacingOrder(true);
      toast.loading("Creating order...");
      const token = await getToken();

      const totalAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02);

      payloadRef.current = {
        address: selectedAddress.id,
        items: cartItemArray,
        amount: totalAmount,
        status: "order placed",
        date: new Date(),
      };

      const { data } = await axios.post("/api/order/create", payloadRef.current, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsPlacingOrder(true);
        toast.dismiss();
        toast.success(data.message);
        router.push("/order-placed");
      } else {
        toast.dismiss();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  const checksizecost = (cartItems) => {
    return Object.values(cartItems).reduce((total, item) => {
      if (item && (item.size === "XXL" || item.size === "3XXL")) {
        return total + (item.quantity || 1);
      }
      return total;
    }, 0);
  };

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>

          {isAddressLoading && (
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <LoaderCircle className="animate-spin w-4 h-4" />
              <span className="text-sm">Loading addresses...</span>
            </div>
          )}

          <div className="relative inline-block w-full text-sm border">
            <button
              disabled={isAddressLoading}
              className={`peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none ${
                isAddressLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses?.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city},{" "}
                    {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Size cost (XXL, 3XXL)</p>
            <p className="font-medium text-gray-800">{currency}{checksizecost(cartItems) * 100}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">{currency}100</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">₹{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              ₹
              {getCartAmount() +
                Math.floor(getCartAmount() * 0.02) +
                checksizecost(cartItems) * 100 +
                100}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={createOrder}
        className="w-full bg-gray-900/90 rounded-sm cursor-pointer text-white py-3 mt-5 hover:bg-gray-900"
      >
        {isPlacingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default OrderSummary;
