import React, { createContext, useContext, useReducer, useEffect } from "react";

// Types (based on your IProduct)
interface CartItem {
  stock: number;
  id: string;
  product:String;
  name: string;
  price: number;
  image: string; // images[0].image
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "quantity"> & { quantity: number };
    }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.max(1, action.payload.quantity) }
              : item
          )
          .filter((item) => item.quantity > 0), // Remove if 0
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("veggi-cart");
    if (saved) {
      try {
        const items = JSON.parse(saved) as CartItem[];
        items.forEach((item) => {
          dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: item.quantity } });
        });
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("veggi-cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (
    item: Omit<CartItem, "quantity"> & { quantity: number }
  ) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotal = () => {
    return state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
