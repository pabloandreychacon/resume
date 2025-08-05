import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GlobalState, CartItem, WishlistItem, Product } from '../types';

// Estado inicial
const initialState: GlobalState = {
  Email: "pabloandreychacon@hotmail.com",
  Phone: "+506 8888-8888",
  Address: "123 Commerce Street Suite 500 New York, NY 10001",
  MapLocation: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d747.5023706999765!2d-84.11690653621802!3d9.9985776402904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0fac4705da317%3A0x1d6528332a4c602!2sMonumento%20Nacional%20Casa%20Alfredo%20Gonz%C3%A1lez%20Flores!5e1!3m2!1ses-419!2scr!4v1753551386846!5m2!1ses-419!2scr",
  BusinessName: "POStore",
  cart: [],
  wishlist: [],
  darkMode: false
};

// Tipos de acciones
type Action =
  | { type: 'SET_STATE'; payload: Partial<GlobalState> }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: number }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_FROM_STORAGE' };

// Reducer
function globalReducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };

    case 'ADD_TO_CART':
      const existingCartItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingCartItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { product: action.payload, quantity: 1 }]
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'ADD_TO_WISHLIST':
      const existingWishlistItem = state.wishlist.find(item => item.product.id === action.payload.id);
      if (!existingWishlistItem) {
        return {
          ...state,
          wishlist: [...state.wishlist, { product: action.payload, addedAt: new Date() }]
        };
      }
      return state;

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.product.id !== action.payload)
      };

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    case 'LOAD_FROM_STORAGE':
      const saved = localStorage.getItem('globalState');
      if (saved) {
        const parsedState = JSON.parse(saved);
        return { ...state, ...parsedState };
      }
      return state;

    default:
      return state;
  }
}

// Context
interface GlobalContextType {
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleDarkMode: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider
interface GlobalProviderProps {
  children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  // Cargar estado desde localStorage al inicializar
  useEffect(() => {
    dispatch({ type: 'LOAD_FROM_STORAGE' });
  }, []);

  // Persistir estado en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('globalState', JSON.stringify(state));
  }, [state]);

  // Funciones helper
  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addToWishlist = (product: Product) => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value: GlobalContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    toggleDarkMode,
    getCartTotal,
    getCartItemCount
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

// Hook personalizado
export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
} 