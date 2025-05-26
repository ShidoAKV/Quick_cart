'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(null); // changed from false to null
    const [isSeller, setIsSeller] = useState(true);
    const [cartItems, setCartItems] = useState({});


    const fetchProductData = async () => {
        setProducts(productsDummyData)
    };

    const fetchUserData = async () => {
        try {
            if (user.publicMetadata.role === 'seller') {
                setIsSeller(true);
            }
            const token = await getToken();
            const { data } = await axios.get('/api/user/data', { headers: { Authorization: `Bearer ${token}` } });

            if (data.success) {
                setUserData(data.user);
                setCartItems(data.user.cartItems);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const createUserIfNotExists=async () => {
    try {
        
        const token =await  getToken();
         if(!token) return ;
            
            const payload = {
            id: user.id,
            name: user.firstName+' '+user.lastName,
            email: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl,
            };

            const res = await axios.post('/api/user/add', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        if (res?.data.success) {
        console.log("✅ User creation success:", res.data.user);
        } else {
        console.warn("⚠️ User creation API responded but not success:", res.data.message);
        }
    } catch (err) {
        toast.error("Failed to create user");
    }
    };


    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = (cartData[itemId] || 0) + 1;
        setCartItems(cartData);
    };

    const updateCartQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData);
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const product = products.find((p) => p._id === itemId);
            if (product && cartItems[itemId] > 0) {
                totalAmount += product.offerPrice * cartItems[itemId];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    useEffect(() => {
        if (user) {
           createUserIfNotExists();
        }
    }, [user]);


    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        if (user) fetchUserData();
    }, [user])



    const value = {
        currency,
        router,
        isSeller,
        setIsSeller,
        userData,
        products,
        cartItems,
        setCartItems,
        addToCart,
        updateCartQuantity,
        getCartCount,
        getCartAmount,
        user, getToken
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
