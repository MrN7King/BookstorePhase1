// frontend/src/hooks/useCart.js
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
const GUEST_CART_KEY = 'guest_cart_v1';

// helper to read local guest cart
const readGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

// get current auth user (customize to your auth system)
const fetchCurrentUser = async () => {
    try {
        const res = await axios.get('/api/user');
        return res.data.user || null;
    } catch {
        return null;
    }
};

// The hook
export default function useCart() {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const syncingRef = useRef(false);


    // extracted init logic so we can re-run it later
    const init = async () => {
        setLoading(true);
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);

        if (!currentUser) {
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
            setLoading(false);
            return;
        }

        try {
            const res = await axios.get('/api/cart');
            if (res.data.success) {
                const serverCart = res.data.cart.map(c => ({
                    id: c.productId._id || c.productId,
                    product: c.productId,
                    quantity: c.quantity
                }));
                setCart(serverCart);

                // Merge guest cart after setting initial server cart
                const guest = readGuestCart();
                if (guest.length) {
                    try {
                        await axios.post('/api/cart/merge', {
                            items: guest.map(g => ({
                                productId: g.productId, // Send just the ID
                                quantity: g.quantity
                            }))
                        });

                        // Refresh cart after merge
                        const res2 = await axios.get('/api/cart');
                        if (res2.data.success) {
                            setCart(res2.data.cart.map(c => ({
                                id: c.productId._id || c.productId,
                                product: c.productId,
                                quantity: c.quantity
                            })));
                        }
                        localStorage.removeItem(GUEST_CART_KEY);
                    } catch (err) {
                        console.error('Cart merge failed', err);
                    }
                }
            }
        } catch (err) {
            console.error('Fetch server cart error', err);
        } finally {
            setLoading(false);
        }
    };

    // init: discover auth, then load appropriate cart
    useEffect(() => {

        // run once on mount
        init();

        // listen for custom event 'authChanged' to re-run initialization (e.g. after login)
        const onAuthChanged = () => {
            init();
        };
        window.addEventListener('authChanged', onAuthChanged);


        return () => {
            window.removeEventListener('authChanged', onAuthChanged);
        };
    }, []);


    // helper: find item index
    const findIndex = (items, productId) => items.findIndex(i => i.id === productId);

    // add/update item (handles guest vs auth)
    const addOrUpdateItem = async (product, quantity = 1) => {
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
            return;
        }

        // logged-in: call API to add/update
        try {
            const res = await axios.post('/api/cart', { productId, quantity });
            if (res.data.success) {
                setCart(res.data.cart.map(c => {
                    // Handle both populated and unpopulated responses
                    const product = c.product || c.productId;

                    return {
                        id: product?._id || c.productId,
                        product: product,
                        quantity: c.quantity
                    };
                }));
            }
        } catch (err) {
            console.error('addOrUpdateItem API error', err);
        }
    };

    // decrease or set quantity
    const setItemQuantity = async (productId, quantity) => {
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
            }
            return;
        }

        // server replace entire cart (simple way). Could be optimized to a single PUT item endpoint.
        try {
            // Build new cart from current server cart and requested change, then PUT /api/cart
            const serverCart = (await axios.get('/api/cart')).data.cart || [];
            const newCart = serverCart.map(c => ({ productId: c.productId._id || c.productId, quantity: c.quantity }));
            const idx = newCart.findIndex(n => n.productId === productId);
            if (idx > -1) newCart[idx].quantity = Math.max(1, quantity);
            await axios.put('/api/cart', { items: newCart });
            const res = await axios.get('/api/cart');
            setCart(res.data.cart.map(c => {
                // Handle both populated and unpopulated responses
                const product = c.product || c.productId;

                return {
                    id: product?._id || c.productId,
                    product: product,
                    quantity: c.quantity
                };
            }));
        } catch (err) {
            console.error('setItemQuantity error', err);
        }
    };

    // remove item
    const removeItem = async (productId) => {
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
            return;
        }
        try {
            const res = await axios.delete(`/api/cart/${productId}`);
            if (res.data.success) {
                setCart(res.data.cart.map(c => {
                    // Handle both populated and unpopulated responses
                    const product = c.product || c.productId;

                    return {
                        id: product?._id || c.productId,
                        product: product,
                        quantity: c.quantity
                    };
                }));
            }
        } catch (err) {
            console.error('remove item error', err);
        }
    };

    // expose API
    return {
        cart,
        setCart,
        loading,
        user,
        addOrUpdateItem,
        setItemQuantity,
        removeItem,
        refresh: init
    };
}
