// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useMiniCart } from './MiniCartContext';

// Create Cart Context
const CartContext = createContext();

// Cart reducer for centralized state management
function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_UPDATING':
      return { ...state, isUpdating: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_ITEM':
      // Check if item already exists
      const existingItemIndex = state.cart.findIndex(item => 
        item.id === action.payload.id
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if exists
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, cart: updatedCart };
      } else {
        // Add new item
        return { ...state, cart: [...state.cart, action.payload] };
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    default:
      return state;
  }
}

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: [],
    loading: true,
    isUpdating: false,
    user: null
  });

  const { showMiniCartWithItem } = useMiniCart();

  // Fetch user and initialize cart
  useEffect(() => {
    const initializeCart = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Check authentication
        const authRes = await axios.post(
          'http://localhost:5000/api/auth/is-auth',
          {},
          { withCredentials: true }
        );
        
        if (authRes.data.success) {
          dispatch({ type: 'SET_USER', payload: authRes.data.user });
          
          // Fetch cart from server
          const cartRes = await axios.get('http://localhost:5000/api/cart');
          if (cartRes.data.success) {
            dispatch({ type: 'SET_CART', payload: cartRes.data.cart });
          }
        } else {
          // Load from localStorage for guest users
          const guestCart = JSON.parse(localStorage.getItem('guest_cart_v1') || '[]');
          const normalizedCart = guestCart.map(item => ({
            id: item.productId,
            product: {
              _id: item.productId,
              name: item.name,
              price: item.price,
              thumbnailUrl: item.thumbnailUrl,
              author: item.author,
              platform: item.platform
            },
            quantity: item.quantity
          }));
          dispatch({ type: 'SET_CART', payload: normalizedCart });
        }
      } catch (error) {
        console.error('Failed to initialize cart:', error);
        // Fallback to localStorage
        try {
          const guestCart = JSON.parse(localStorage.getItem('guest_cart_v1') || '[]');
          const normalizedCart = guestCart.map(item => ({
            id: item.productId,
            product: {
              _id: item.productId,
              name: item.name,
              price: item.price,
              thumbnailUrl: item.thumbnailUrl,
              author: item.author,
              platform: item.platform
            },
            quantity: item.quantity
          }));
          dispatch({ type: 'SET_CART', payload: normalizedCart });
        } catch (e) {
          console.error('Failed to load guest cart:', e);
          dispatch({ type: 'SET_CART', payload: [] });
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeCart();
  }, []);

  // Sync cart to localStorage when user is not logged in
  useEffect(() => {
    if (!state.user && !state.loading) {
      const guestCart = state.cart.map(item => ({
        productId: item.id,
        name: item.product?.name,
        price: item.product?.price,
        thumbnailUrl: item.product?.thumbnailUrl,
        author: item.product?.author,
        platform: item.product?.platform,
        quantity: item.quantity
      }));
      localStorage.setItem('guest_cart_v1', JSON.stringify(guestCart));
    }
  }, [state.cart, state.user, state.loading]);

  // Add or update item in cart
  const addOrUpdateItem = async (product, quantity = 1) => {
    if (!product || (!product._id && !product.id)) {
      console.warn('Invalid product passed to addOrUpdateItem');
      return;
    }
    
    const productId = product._id || product.id;
    const existingItem = state.cart.find(item => item.id === productId);
    const isNewItem = !existingItem;
    
    // Optimistic update
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: {
        id: productId,
        product: {
          _id: productId,
          name: product.name,
          price: product.price,
          thumbnailUrl: product.thumbnailUrl,
          author: product.author,
          platform: product.platform
        },
        quantity
      }
    });
    
    dispatch({ type: 'SET_UPDATING', payload: true });

    try {
      if (state.user) {
        // Server cart logic
        const res = await axios.post('http://localhost:5000/api/cart', {
          productId,
          quantity: existingItem ? existingItem.quantity + quantity : quantity
        });
        
        if (res.data.success && res.data.cart) {
          // Update with server response for consistency
          dispatch({ type: 'SET_CART', payload: res.data.cart });
        }
      }
      
      // Show mini cart for new items
      if (isNewItem) {
        showMiniCartWithItem({
          id: productId,
          title: product.name,
          image: product.thumbnailUrl,
          price: product.price,
          author: product.author || product.platform || ''
        });
      }
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('cartChanged', {
        detail: { 
          type: isNewItem ? 'itemAdded' : 'itemUpdated',
          productId,
          product,
          isNewItem
        }
      }));
    } catch (err) {
      console.error('Failed to sync cart with server:', err);
      // Revert optimistic update on failure
      if (existingItem) {
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: {
            productId,
            quantity: existingItem.quantity
          }
        });
      } else {
        dispatch({
          type: 'REMOVE_ITEM',
          payload: productId
        });
      }
    } finally {
      dispatch({ type: 'SET_UPDATING', payload: false });
    }
  };

  // Set item quantity
  const setItemQuantity = async (productId, newQuantity) => {
    const validQuantity = Math.max(1, newQuantity);
    const originalItem = state.cart.find(item => item.id === productId);
    
    if (!originalItem) return;
    
    // Optimistic update
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity: validQuantity }
    });
    
    dispatch({ type: 'SET_UPDATING', payload: true });

    try {
      if (state.user) {
        await axios.post('http://localhost:5000/api/cart', {
          productId,
          quantity: validQuantity
        });
      }
      
      window.dispatchEvent(new CustomEvent('cartChanged', {
        detail: { 
          type: 'quantityChanged',
          productId,
          quantity: validQuantity
        }
      }));
    } catch (err) {
      console.error('Failed to update quantity:', err);
      // Revert on error
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { productId, quantity: originalItem.quantity }
      });
    } finally {
      dispatch({ type: 'SET_UPDATING', payload: false });
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    const originalItem = state.cart.find(item => item.id === productId);
    
    if (!originalItem) return;
    
    // Optimistic update
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    dispatch({ type: 'SET_UPDATING', payload: true });

    try {
      if (state.user) {
        await axios.delete(`http://localhost:5000/api/cart/${productId}`);
      }
      
      window.dispatchEvent(new CustomEvent('cartChanged', {
        detail: { type: 'itemRemoved', productId }
      }));
    } catch (err) {
      console.error('Failed to remove item:', err);
      // Revert on error
      dispatch({
        type: 'ADD_ITEM',
        payload: originalItem
      });
    } finally {
      dispatch({ type: 'SET_UPDATING', payload: false });
    }
  };

  // Clear cart
  const clearCart = async () => {
    const originalCart = [...state.cart];
    
    // Optimistic update
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ type: 'SET_UPDATING', payload: true });

    try {
      if (state.user) {
        await axios.put('http://localhost:5000/api/cart', { items: [] });
      } else {
        localStorage.removeItem('guest_cart_v1');
      }
      
      window.dispatchEvent(new CustomEvent('cartChanged', {
        detail: { type: 'cartCleared' }
      }));
    } catch (err) {
      console.error('Failed to clear cart:', err);
      // Revert on error
      dispatch({ type: 'SET_CART', payload: originalCart });
    } finally {
      dispatch({ type: 'SET_UPDATING', payload: false });
    }
  };

  // Refresh cart from server
  const refresh = async () => {
    if (!state.user) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.get('http://localhost:5000/api/cart');
      
      if (res.data.success) {
        dispatch({ type: 'SET_CART', payload: res.data.cart });
      }
    } catch (err) {
      console.error('Failed to refresh cart:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    cart: state.cart,
    loading: state.loading,
    isUpdating: state.isUpdating,
    user: state.user,
    addOrUpdateItem,
    setItemQuantity,
    removeItem,
    clearCart,
    refresh
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};