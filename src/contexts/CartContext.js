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
            console.log(`✅ Cart initialized with ${cart.length} items`);
            return cart;
        } catch (error) {
            console.error('❌ Error parsing cart data:', error);
            return [];
        }
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        console.log(`💾 Saving cart to localStorage (${cartItems.length} items)`);
        localStorage.setItem('goodnews_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        console.log('🛍️ Adding item to cart:', item.title);
        setCartItems(prev => {
            // Check if item with same ID/Title/Specs already exists
            // For now, simple unique ID generation based on timestamp if not provided
            const newItem = { ...item, cartId: Date.now() };
            console.log(`✅ Item added to cart. Cart now has ${prev.length + 1} items`);
            return [...prev, newItem];
        });
        setIsCartOpen(true); // Open cart drawer/feedback
    };

    const removeFromCart = (cartId) => {
        console.log(`🗑️ Removing item from cart: ${cartId}`);
        setCartItems(prev => {
            const filtered = prev.filter(item => item.cartId !== cartId);
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
        // This assumes price is a number or can be parsed.
        // Our prices are like "ETB150". We need to parse this.
        const total = cartItems.reduce((total, item) => {
            const priceString = item.price.toString().replace(/[^0-9.]/g, '');
            const price = parseFloat(priceString) || 0;
            return total + price;
        }, 0);
        console.log(`💰 Cart total calculated: ETB ${total}`);
        return total;
    };

    const getCartCount = () => {
        return cartItems.length;
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
