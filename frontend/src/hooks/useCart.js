// frontend/src/hooks/useCart.js
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

axios.defaults.withCredentials = true;
const GUEST_CART_KEY = 'guest_cart_v1';

// Helper to read local guest cart
const readGuestCart = () => {
    try {
        const raw = localStorage.getItem(GUEST_CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error("Failed to parse guest cart from localStorage:", e);
        return [];
    }
};

const writeGuestCart = (items) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

// Get current auth user
const fetchCurrentUser = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/auth/data');
        return res.data.user || null;
    } catch (e) {
        console.error('Failed to fetch user:', e);
        return null;
    }
};

// The hook
export default function useCart() {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // The core cart loading logic
    const init = useCallback(async (currentUser) => {
        setLoading(true);

        try {
            if (currentUser) {
                const res = await axios.get('http://localhost:5000/api/cart');
                
                if (res.data && Array.isArray(res.data.cart)) {
                    const serverCart = res.data.cart.map(item => ({
                        id: item.productId || (item.product && item.product._id),
                        product: item.product || {
                            _id: item.productId,
                            name: 'Unknown Product',
                            price: 0,
                            thumbnailUrl: ''
                        },
                        quantity: item.quantity
                    }));
                    setCart(serverCart);
                } else {
                    console.error('init: API call failed or returned invalid data. Response:', res.data);
                    setCart([]);
                }
            } else {
                const guestCart = readGuestCart().map(item => ({
                    id: item.productId,
                    product: {
                        _id: item.productId,
                        name: item.name,
                        price: Number(item.price ?? 0),
                        thumbnailUrl: item.thumbnailUrl
                    },
                    quantity: item.quantity
                }));
                setCart(guestCart);
            }
        } catch (err) {
            console.error('init: Failed to initialize cart. Check network and CORS issues.', err);
            setCart([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect hook to synchronize authentication and cart loading
    useEffect(() => {
        const syncCart = async () => {
            const currentUser = await fetchCurrentUser();
            setUser(currentUser);
            init(currentUser);
        };
        syncCart();

        const onAuthChanged = () => {
            syncCart();
        };
        
        const onCartUpdated = () => {
            syncCart();
        };
        
        window.addEventListener('authChanged', onAuthChanged);
        window.addEventListener('cartUpdated', onCartUpdated);
        
        return () => {
            window.removeEventListener('authChanged', onAuthChanged);
            window.removeEventListener('cartUpdated', onCartUpdated);
        };
    }, [init]);

    // Clear cart function
    const clearCart = useCallback(async () => {
        if (!user) {
            writeGuestCart([]);
            setCart([]);
        } else {
            try {
                await axios.put('http://localhost:5000/api/cart', { items: [] });
                setCart([]);
            } catch (err) {
                console.error('Failed to clear server cart:', err);
                setCart([]);
            }
        }
        window.dispatchEvent(new Event('cartUpdated'));
    }, [user]);

    // add/update item (handles guest vs auth)
    const addOrUpdateItem = useCallback(async (product, quantity = 1) => {
        if (!product || !product._id && !product.id) {
            console.warn('Invalid product passed to addOrUpdateItem');
            return;
        }
        const productId = product._id || product.id;
        
        if (!user) {
            const existing = readGuestCart();
            const idx = existing.findIndex(i => i.productId === productId);
            if (idx > -1) {
                existing[idx].quantity += quantity;
            } else {
                existing.push({
                    productId,
                    name: product.name,
                    price: product.price,
                    thumbnailUrl: product.thumbnailUrl,
                    quantity
                });
            }
            writeGuestCart(existing);
            setCart(existing.map(i => ({
                id: i.productId,
                product: {
                    _id: i.productId,
                    name: i.name,
                    price: i.price,
                    thumbnailUrl: i.thumbnailUrl
                },
                quantity: i.quantity
            })));
            window.dispatchEvent(new Event('cartUpdated'));
            return;
        }
        
        // logged-in: call API to add/update
        try {
            const res = await axios.post('http://localhost:5000/api/cart', { productId, quantity });
            if (res.data.success) {
                setCart(res.data.cart.map(c => {
                    const product = c.product || c.productId;
                    return {
                        id: product?._id || c.productId,
                        product: product,
                        quantity: c.quantity
                    };
                }));
                window.dispatchEvent(new Event('cartUpdated'));
            }
        } catch (err) {
            console.error('addOrUpdateItem API error', err);
        }
    }, [user]);

    // decrease or set quantity
    const setItemQuantity = useCallback(async (productId, quantity) => {
        if (!user) {
            const existing = readGuestCart();
            const idx = existing.findIndex(i => i.productId === productId);
            if (idx > -1) {
                existing[idx].quantity = Math.max(1, quantity);
                writeGuestCart(existing);
                setCart(existing.map(i => ({
                    id: i.productId,
                    product: {
                        _id: i.productId,
                        name: i.name,
                        price: i.price,
                        thumbnailUrl: i.thumbnailUrl
                    },
                    quantity: i.quantity
                })));
                window.dispatchEvent(new Event('cartUpdated'));
            }
            return;
        }
        try {
            const serverCart = (await axios.get('http://localhost:5000/api/cart')).data.cart || [];
            const newCart = serverCart.map(c => ({ productId: c.product._id || c.productId, quantity: c.quantity }));
            const idx = newCart.findIndex(n => n.productId === productId);
            if (idx > -1) newCart[idx].quantity = Math.max(1, quantity);
            await axios.put('http://localhost:5000/api/cart', { items: newCart });
            const res = await axios.get('http://localhost:5000/api/cart');
            setCart(res.data.cart.map(c => {
                const product = c.product || c.productId;
                return {
                    id: product?._id || c.productId,
                    product: product,
                    quantity: c.quantity
                };
            }));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error('setItemQuantity error', err);
        }
    }, [user]);

    // remove item
    const removeItem = useCallback(async (productId) => {
        if (!user) {
            const existing = readGuestCart().filter(i => i.productId !== productId);
            writeGuestCart(existing);
            setCart(existing.map(i => ({
                id: i.productId,
                product: {
                    _id: i.productId,
                    name: i.name,
                    price: i.price,
                    thumbnailUrl: i.thumbnailUrl
                },
                quantity: i.quantity
            })));
            window.dispatchEvent(new Event('cartUpdated'));
            return;
        }
        try {
            const res = await axios.delete(`http://localhost:5000/api/cart/${productId}`);
            if (res.data.success) {
                setCart(res.data.cart.map(c => {
                    const product = c.product || c.productId;
                    return {
                        id: product?._id || c.productId,
                        product: product,
                        quantity: c.quantity
                    };
                }));
                window.dispatchEvent(new Event('cartUpdated'));
            }
        } catch (err) {
            console.error('remove item error', err);
        }
    }, [user]);

    return {
        cart,
        setCart,
        loading,
        user,
        addOrUpdateItem,
        setItemQuantity,
        removeItem,
        clearCart,
        refresh: () => init(user)
    };
}