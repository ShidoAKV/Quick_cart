'use client'
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
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
    const authToken = useRef(null);
    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [topcomment,setTopcomment]=useState(null);


    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list');

            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }

    };

    const fetchUserData = async () => {
        try {
            const token = await getToken();
            authToken.current = token;
            const { data } = await axios.get('/api/user/data', { headers: { Authorization: `Bearer ${token}` } });

            if (data.success) {
                setUserData(data.user);
                setCartItems(data.user.cartItems);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    const createUser = async (token) => {
        try {
            const payload = {
                id: user.id,
                name: user.firstName + ' ' + user.lastName,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl,
            };

            const { data } = await axios.post('/api/user/add', payload, {
                headers: {
                    Authorization: `Bearer${token}`,
                },
            });

            if (data.success) {
                toast.success('user created successfully');
               if (user?.publicMetadata.role === 'seller') {
                    setIsSeller(true);
                } else {
                    setIsSeller(false);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    const createUserIfNotExists = async () => {
        try {
            if (!user) return;

            const token = await getToken();
            authToken.current = token;

            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setUserData(data.user);
                setCartItems(data.user.cartItems);
                
                if (user?.publicMetadata.role === 'seller') {
                    setIsSeller(true);
                } else {
                    setIsSeller(false);
                }

            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                const token = await getToken();
                await createUser(token);
            } else {
                toast.error(error.message)
            }
        }
    };


    const generateCartKey = (productId, size, color) => `${productId}|${size}|${color}`;

    const addToCart = async (productId, size, color) => {
        if (!size || !color) {
            toast.error("Please select both size and color");
            return;
        }

        const cartKey = generateCartKey(productId, size, color);
        const newCart = structuredClone(cartItems);

        if (newCart[cartKey]) {
            newCart[cartKey].quantity += 1;
        } else {
            newCart[cartKey] = { productId, size, color, quantity: 1 };
        }

        setCartItems(newCart);

        if (user) {
            try {
                await axios.post('/api/cart/update', { cartData: newCart }, {
                    headers: { Authorization: `Bearer ${authToken.current}` }
                });
            } catch (error) {
                toast.error("Failed to sync with server");
            }
        }
        toast.success('item added to cart');

    };

    const updateCartQuantity = async (productId, size, color, quantity) => {
        const cartKey = generateCartKey(productId, size, color);
        const newCart = structuredClone(cartItems);


        if (quantity === 0) {
            delete newCart[cartKey];
        } else {
            if (newCart[cartKey]) {
                newCart[cartKey].quantity = quantity;
            } else {
                newCart[cartKey] = { productId, size, color, quantity };
            }
        }

        setCartItems(newCart);

        if (user) {
            try {
                await axios.post('/api/cart/update', { cartData: newCart }, {
                    headers: { Authorization: `Bearer ${authToken.current}` }
                });
            } catch (error) {
                toast.error("Cart update failed");
            }
        }
        toast.success('Cart updated');
    };

    const getCartAmount = () => {
        let total = 0;
        for (const cartKey in cartItems) {
            const item = cartItems[cartKey];
            if (!item || !item.productId || item.quantity <= 0) continue;
            const product = products.find(p => p.id === item.productId);
            if (product) {
                total += product.offerPrice * item.quantity;
            }
        }
        return Math.floor(total * 100) / 100;
    };
    const getCartCount = () => {
        return Object.values(cartItems).reduce((sum, item) => {
            const qty = item && typeof item.quantity === 'number' ? item.quantity : 0;
            return sum + qty;
        }, 0);
    };

   const fetchcomment = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/product/comment/topcomments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(data.success){
          setTopcomment(data.topComment);
      }else{
        toast.error(data.message);
      }

    } catch (error) {
      toast.error( error.message);
    }
  };




    useEffect(() => {
        if (user) {
            createUserIfNotExists();
        }
    }, [user]);


    useEffect(() => {
       if(user){
        fetchProductData();
        fetchcomment();
       }
    }, [user]);

    // useEffect(() => {
    //     if (user) fetchUserData();
    // }, [user])



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
        user, getToken, authToken,topcomment,fetchcomment
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
