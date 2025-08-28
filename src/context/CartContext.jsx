import { createContext, useContext, useState } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  // Leer del localStorage al iniciar
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('neotec-cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('neotec-cart', JSON.stringify(cart));
  }, [cart]);

 const addToCart = (product) => {
  console.log('addToCart recibe:', product);
  setCart(prev => {
    const existe = prev.find(p => p.id === product.id);
    if (existe) {
      return prev.map(p =>
        p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
    }
    return [...prev, { ...product, cantidad: 1 }];
  });
};

  const removeFromCart = (id) =>
    setCart(prev => prev.filter(p => p.id !== id));

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, p) => sum + p.price * p.cantidad, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}