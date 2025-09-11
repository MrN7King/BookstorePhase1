// frontend/src/hooks/useCart.js
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useMiniCart } from '../context/MiniCartContext';

axios.defaults.withCredentials = true;
const GUEST_CART_KEY = 'guest_cart_v1';

// Helper functions
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

const fetchCurrentUser = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/auth/data');
        return res.data.user || null;
    } catch (e) {
        console.error('Failed to fetch user:', e);
        return null;
    }
};

// Normalize cart data from different sources
const normalizeCartItem = (item) => {
    // Handle different data structures from server vs guest cart
    const product = item.product || item.productId || {};
    const productId = product._id || item.productId || item.id;
    
    return {
        id: productId,
        product: {
            _id: productId,
            name: product.name || item.name,
            price: Number(product.price ?? item.price ?? 0),
            thumbnailUrl: product.thumbnailUrl || item.thumbnailUrl,
            author: product.author || item.author,
            platform: product.platform || item.platform
        },
        quantity: item.quantity || 1
    };
};

export default function useCart() {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const { showMiniCartWithItem } = useMiniCart();

    // Enhanced event dispatcher with more detailed info
    const dispatchCartEvent = useCallback((eventType, data = {}) => {
        const event = new CustomEvent('cartChanged', {
            detail: { type: eventType, timestamp: Date.now(), ...data }
        });
        window.dispatchEvent(event);
    }, []);

    // Initialize cart data
    const init = useCallback(async (currentUser, silent = false) => {
        if (!silent) setLoading(true);

        try {
            let cartData = [];
            
            if (currentUser) {
                // Fetch from server for logged-in users
                const res = await axios.get('http://localhost:5000/api/cart');
                if (res.data.success && Array.isArray(res.data.cart)) {
                    cartData = res.data.cart.map(normalizeCartItem);
                } else {
                    console.warn('Server returned invalid cart data:', res.data);
                }
            } else {
                // Load from localStorage for guest users
                const guestData = readGuestCart();
                cartData = guestData.map(item => normalizeCartItem({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    thumbnailUrl: item.thumbnailUrl,
                    quantity: item.quantity
                }));
            }
            
            setCart(cartData);
            
            if (!silent) {
                dispatchCartEvent('cartLoaded', { itemCount: cartData.length });
            }
            
        } catch (err) {
            console.error('Failed to initialize cart:', err);
            setCart([]);
            if (!silent) {
                dispatchCartEvent('cartError', { error: err.message });
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, [dispatchCartEvent]);

    // Authentication and cart sync
    useEffect(() => {
        const syncCart = async () => {
            const currentUser = await fetchCurrentUser();
            setUser(currentUser);
            await init(currentUser);
        };
        
        syncCart();

        const handleAuthChange = () => syncCart();
        window.addEventListener('authChanged', handleAuthChange);
        
        return () => window.removeEventListener('authChanged', handleAuthChange);
    }, [init]);

    // Add or update item with immediate UI feedback
    const addOrUpdateItem = useCallback(async (product, quantity = 1) => {
        if (!product || (!product._id && !product.id)) {
            console.warn('Invalid product passed to addOrUpdateItem');
            return;
        }
        
        const productId = product._id || product.id;
        const existingItem = cart.find(item => item.id === productId);
        const isNewItem = !existingItem;
        
        // Prepare normalized product
        const normalizedProduct = {
            _id: productId,
            name: product.name,
            price: Number(product.price ?? 0),
            thumbnailUrl: product.thumbnailUrl,
            author: product.author,
            platform: product.platform
        };

        // IMMEDIATE optimistic update
        let optimisticCart;
        if (existingItem) {
            optimisticCart = cart.map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            const newItem = {
                id: productId,
                product: normalizedProduct,
                quantity
            };
            optimisticCart = [...cart, newItem];
        }
        
        // Update UI immediately
        setCart(optimisticCart);
        setIsUpdating(true);

        // Show mini cart immediately for new items
        if (isNewItem) {
            showMiniCartWithItem({
                id: productId,
                title: product.name,
                image: product.thumbnailUrl,
                price: product.price,
                author: product.author || product.platform || ''
            });
        }

        // Dispatch event immediately
        dispatchCartEvent(isNewItem ? 'itemAdded' : 'itemUpdated', {
            productId,
            product: normalizedProduct,
            isNewItem,
            quantity: existingItem ? existingItem.quantity + quantity : quantity
        });

        try {
            if (!user) {
                // Guest cart logic
                const guestCart = readGuestCart();
                const existingIndex = guestCart.findIndex(item => item.productId === productId);
                
                if (existingIndex > -1) {
                    guestCart[existingIndex].quantity += quantity;
                } else {
                    guestCart.push({
                        productId,
                        name: product.name,
                        price: product.price,
                        thumbnailUrl: product.thumbnailUrl,
                        quantity
                    });
                }
                
                writeGuestCart(guestCart);
            } else {
                // Server cart logic
                const res = await axios.post('http://localhost:5000/api/cart', {
                    productId,
                    quantity: existingItem ? existingItem.quantity + quantity : quantity
                });
                
                if (res.data.success && res.data.cart) {
                    // Update with server response for consistency
                    const serverCart = res.data.cart.map(normalizeCartItem);
                    setCart(serverCart);
                } else {
                    throw new Error('Server response was not successful');
                }
            }
        } catch (err) {
            console.error('Failed to sync cart with server:', err);
            // Rollback optimistic update on failure
            setCart(cart);
            dispatchCartEvent('cartError', { error: err.message, action: 'addItem' });
        } finally {
            setIsUpdating(false);
        }
    }, [user, cart, showMiniCartWithItem, dispatchCartEvent]);

    // Set item quantity with optimistic updates
    const setItemQuantity = useCallback(async (productId, newQuantity) => {
        const validQuantity = Math.max(1, newQuantity);
        const originalCart = [...cart];
        
        // Optimistic update
        const optimisticCart = cart.map(item =>
            item.id === productId ? { ...item, quantity: validQuantity } : item
        );
        
        setCart(optimisticCart);
        setIsUpdating(true);
        
        dispatchCartEvent('quantityChanged', { productId, quantity: validQuantity });
        
        try {
            if (!user) {
                const guestCart = readGuestCart();
                const itemIndex = guestCart.findIndex(item => item.productId === productId);
                if (itemIndex > -1) {
                    guestCart[itemIndex].quantity = validQuantity;
                    writeGuestCart(guestCart);
                }
            } else {
                // For server, we need to get current cart and update it
                const currentServerCart = (await axios.get('http://localhost:5000/api/cart')).data.cart || [];
                const updatedItems = currentServerCart.map(item => ({
                    productId: item.product._id || item.productId,
                    quantity: item.product._id === productId ? validQuantity : item.quantity
                }));
                
                await axios.put('http://localhost:5000/api/cart', { items: updatedItems });
                
                // Refresh cart to ensure consistency
                await init(user, true);
            }
        } catch (err) {
            console.error('Failed to update quantity:', err);
            setCart(originalCart); // Rollback
            dispatchCartEvent('cartError', { error: err.message, action: 'updateQuantity' });
        } finally {
            setIsUpdating(false);
        }
    }, [user, cart, init, dispatchCartEvent]);

    // Remove item with optimistic updates
    const removeItem = useCallback(async (productId) => {
        const originalCart = [...cart];
        
        // Optimistic removal
        const optimisticCart = cart.filter(item => item.id !== productId);
        setCart(optimisticCart);
        setIsUpdating(true);
        
        dispatchCartEvent('itemRemoved', { productId });
        
        try {
            if (!user) {
                const guestCart = readGuestCart().filter(item => item.productId !== productId);
                writeGuestCart(guestCart);
            } else {
                const res = await axios.delete(`http://localhost:5000/api/cart/${productId}`);
                if (res.data.success && res.data.cart) {
                    const serverCart = res.data.cart.map(normalizeCartItem);
                    setCart(serverCart);
                }
            }
        } catch (err) {
            console.error('Failed to remove item:', err);
            setCart(originalCart); // Rollback
            dispatchCartEvent('cartError', { error: err.message, action: 'removeItem' });
        } finally {
            setIsUpdating(false);
        }
    }, [user, cart, dispatchCartEvent]);

    // Clear cart
    const clearCart = useCallback(async () => {
        const originalCart = [...cart];
        
        // Optimistic clear
        setCart([]);
        setIsUpdating(true);
        
        dispatchCartEvent('cartCleared');
        
        try {
            if (!user) {
                writeGuestCart([]);
            } else {
                await axios.put('http://localhost:5000/api/cart', { items: [] });
            }
        } catch (err) {
            console.error('Failed to clear cart:', err);
            setCart(originalCart); // Rollback
            dispatchCartEvent('cartError', { error: err.message, action: 'clearCart' });
        } finally {
            setIsUpdating(false);
        }
    }, [user, cart, dispatchCartEvent]);

    return {
        cart,
        loading,
        isUpdating,
        user,
        addOrUpdateItem,
        setItemQuantity,
        removeItem,
        clearCart,
        refresh: () => init(user)
    };
}