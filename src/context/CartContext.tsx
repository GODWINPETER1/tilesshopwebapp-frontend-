import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';

import { cartAPI } from '../services/api';
import { Cart, CartItem } from '../types/index';

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;

  cartItemCount: number;

  refreshCart: () => Promise<void>;

  addToCart: (
    productId: number,
    variantId: number,
    quantity?: number
  ) => Promise<void>;

  updateQuantity: (
    itemId: number,
    quantity: number
  ) => Promise<void>;

  removeFromCart: (
    itemId: number
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  resetCartState: () => void;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart | null>(null);

  const [items, setItems] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

 


  // =====================================================
  // Refresh cart
  // =====================================================

  const refreshCart = async () => {
    try {
      setError(null);

      const response = await cartAPI.getCart();

      if (response.data.success && response.data.data) {
        setCart(response.data.data.cart);
        setItems(response.data.data.items || []);
      } else {
        setCart(null);
        setItems([]);
      }
    } catch (err: any) {
      console.error('Failed to load cart:', err);

      setError(
        err.response?.data?.message ||
        'Failed to load cart'
      );
    }
  };


  // =====================================================
  // Initial cart load
  // =====================================================

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);

      await refreshCart();

      setLoading(false);
    };

    loadCart();
  }, []);


  // =====================================================
  // Add to cart
  // =====================================================

  const addToCart = async (
    productId: number,
    variantId: number,
    quantity: number = 1
  ) => {
    try {
      setError(null);

      const response = await cartAPI.addItem(
        productId,
        variantId,
        quantity
      );

      if (
        response.data.success &&
        response.data.data
      ) {
        setCart(response.data.data.cart);

        setItems(
          response.data.data.items || []
        );

        return;
      }

      throw new Error(
        response.data.message ||
        'Failed to add item to cart'
      );

    } catch (err: any) {
      console.error(
        'Failed to add item to cart:',
        err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to add item to cart';

      setError(message);

      throw new Error(message);
    }
  };


  // =====================================================
  // Update quantity
  // =====================================================

  const updateQuantity = async (
    itemId: number,
    quantity: number
  ) => {
    try {
      setError(null);

      const response =
        await cartAPI.updateItem(
          itemId,
          quantity
        );

      if (
        response.data.success &&
        response.data.data
      ) {
        setCart(response.data.data.cart);

        setItems(
          response.data.data.items || []
        );

        return;
      }

      throw new Error(
        response.data.message ||
        'Failed to update cart'
      );

    } catch (err: any) {
      console.error(
        'Failed to update cart:',
        err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to update cart';

      setError(message);

      throw new Error(message);
    }
  };


  // =====================================================
  // Remove item
  // =====================================================

  const removeFromCart = async (
    itemId: number
  ) => {
    try {
      setError(null);

      const response =
        await cartAPI.removeItem(itemId);

      if (
        response.data.success &&
        response.data.data
      ) {
        setCart(response.data.data.cart);

        setItems(
          response.data.data.items || []
        );

        return;
      }

      throw new Error(
        response.data.message ||
        'Failed to remove item'
      );

    } catch (err: any) {
      console.error(
        'Failed to remove cart item:',
        err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to remove item';

      setError(message);

      throw new Error(message);
    }
  };


  // =====================================================
  // Clear cart
  // =====================================================

  const clearCart = async () => {
    try {
      setError(null);

      const response =
        await cartAPI.clear();

      if (
        response.data.success &&
        response.data.data
      ) {
        setCart(response.data.data.cart);

        setItems(
          response.data.data.items || []
        );

        return;
      }

      throw new Error(
        response.data.message ||
        'Failed to clear cart'
      );

    } catch (err: any) {
      console.error(
        'Failed to clear cart:',
        err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to clear cart';

      setError(message);

      throw new Error(message);
    }
  };

  // reset local cart state

  const resetCartState = useCallback(() => {

    setCart(null);
    setItems([]);
    setError(null)
  } , [])


  // =====================================================
  // Total item count
  // =====================================================

  const cartItemCount = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        loading,
        error,

        cartItemCount,

        refreshCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        resetCartState
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


// =====================================================
// useCart hook
// =====================================================

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    );
  }

  return context;
};