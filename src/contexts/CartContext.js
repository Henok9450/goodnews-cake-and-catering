import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            console.log('🛒 Initializing cart from localStorage...');
            const savedCart = localStorage.getItem('goodnews_cart');
            const cart = savedCart ? JSON.parse(savedCart) : [];
            const safeCart = Array.isArray(cart) ? cart : [];
            console.log(`✅ Cart initialized with ${safeCart.length} items`);
            return safeCart;
        } catch (error) {
            console.error('❌ Error parsing cart data:', error);
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        const safeItems = Array.isArray(cartItems) ? cartItems : [];
        console.log(`💾 Saving cart to localStorage (${safeItems.length} items)`);
        localStorage.setItem('goodnews_cart', JSON.stringify(safeItems));
    }, [cartItems]);

    const addToCart = (item) => {
        if (!item) return;
        console.log('🛍️ Adding item to cart:', item.title || item.orderType);
        setCartItems(prev => {
            const list = Array.isArray(prev) ? prev : [];
            const newItem = { ...item, cartId: item.cartId || (Date.now() + Math.random()) };
            console.log(`✅ Item added to cart. Cart now has ${list.length + 1} items`);
            return [...list, newItem];
        });
        setIsCartOpen(true); // Open cart drawer/feedback
    };

    const removeFromCart = (cartId) => {
        console.log(`🗑️ Removing item from cart: ${cartId}`);
        setCartItems(prev => {
            const list = Array.isArray(prev) ? prev : [];
            const filtered = list.filter(item => item && item.cartId !== cartId);
            console.log(`✅ Item removed. Cart now has ${filtered.length} items`);
            return filtered;
        });
    };

    const clearCart = () => {
        console.log('🧹 Clearing entire cart');
        setCartItems([]);
        console.log('✅ Cart cleared');
    };

    const getCartTotal = () => {
        if (!Array.isArray(cartItems)) return 0;
        const total = cartItems.reduce((total, item) => {
            if (!item || item.price == null) return total;
            const priceString = String(item.price).replace(/[^0-9.]/g, '');
            const price = parseFloat(priceString) || 0;
            return total + price;
        }, 0);
        console.log(`💰 Cart total calculated: ETB ${total}`);
        return total;
    };

    const getCartCount = () => {
        return Array.isArray(cartItems) ? cartItems.length : 0;
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        setIsCartOpen
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
