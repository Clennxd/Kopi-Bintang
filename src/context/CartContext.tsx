import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';
import type {
  CartItem,
  IceLevel,
  MenuItem,
  Size,
  StoreSettings,
  SugarLevel
} from '../types';
import { DEFAULT_STORE_SETTINGS, fetchStoreSettings } from '../lib/supabase';

const CART_STORAGE_KEY = 'kopi-bintang-cart-v1';
const TAX_RATE = 0.1;
const TOAST_DURATION_MS = 3000;

export const LARGE_SIZE_UPCHARGE = 6000;

export const calculateUnitPrice = (basePrice: number, size: Size): number =>
  basePrice + (size === 'Large' ? LARGE_SIZE_UPCHARGE : 0);

const SIZE_VALUES: readonly string[] = ['Regular', 'Large'];
const SUGAR_VALUES: readonly string[] = ['Normal', 'Less Sugar', 'No Sugar'];
const ICE_VALUES: readonly string[] = ['Normal Ice', 'Less Ice', 'Hot'];

const buildCartItemId = (
  menuItemId: string,
  size: Size,
  sugarLevel: SugarLevel,
  iceLevel: IceLevel,
  note?: string
): string => {
  const normalizedNote =
    note !== undefined && note.trim().length > 0
      ? note.trim().toLowerCase().replace(/\s+/g, '-')
      : 'standar';
  return [menuItemId, size, sugarLevel, iceLevel, normalizedNote].join('__');
};

const isStoredMenuItem = (value: unknown): value is MenuItem => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.category_slug === 'string' &&
    typeof record.description === 'string' &&
    Array.isArray(record.tasting_notes) &&
    record.tasting_notes.every((note): note is string => typeof note === 'string') &&
    typeof record.price === 'number' &&
    typeof record.image_url === 'string' &&
    typeof record.is_signature === 'boolean' &&
    typeof record.is_available === 'boolean'
  );
};

const isStoredCartItem = (value: unknown): value is CartItem => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    isStoredMenuItem(record.menuItem) &&
    typeof record.quantity === 'number' &&
    Number.isInteger(record.quantity) &&
    record.quantity > 0 &&
    typeof record.size === 'string' &&
    SIZE_VALUES.includes(record.size) &&
    typeof record.sugarLevel === 'string' &&
    SUGAR_VALUES.includes(record.sugarLevel) &&
    typeof record.iceLevel === 'string' &&
    ICE_VALUES.includes(record.iceLevel) &&
    typeof record.itemPriceTotal === 'number' &&
    Number.isFinite(record.itemPriceTotal) &&
    record.itemPriceTotal >= 0 &&
    (record.note === undefined || typeof record.note === 'string')
  );
};

const loadInitialCart = (): CartItem[] => {
  try {
    const rawStorage = window.localStorage.getItem(CART_STORAGE_KEY);
    if (rawStorage === null) return [];
    const parsed: unknown = JSON.parse(rawStorage);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredCartItem);
  } catch {
    return [];
  }
};

export interface CartContextValue {
  cart: CartItem[];
  isCartOpen: boolean;
  selectedProductForCustomization: MenuItem | null;
  storeSettings: StoreSettings;
  toastMessage: string | null;
  totalItemsCount: number;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  addToCart: (item: Omit<CartItem, 'id' | 'itemPriceTotal'>) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openProductModal: (product: MenuItem) => void;
  closeProductModal: () => void;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const useCartContext = (): CartContextValue => {
  const contextValue = useContext(CartContext);
  if (contextValue === null) {
    throw new Error('useCartContext hanya boleh digunakan di dalam CartProvider.');
  }
  return contextValue;
};

export const useCart = (): CartContextValue => useCartContext();

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>(loadInitialCart);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProductForCustomization, setSelectedProductForCustomization] =
    useState<MenuItem | null>(null);
  const [storeSettings, setStoreSettings] =
    useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchStoreSettings().then((result) => {
      if (!cancelled) setStoreSettings(result.settings);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      return;
    }
  }, [cart]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, TOAST_DURATION_MS);
  }, []);

  const addToCart = useCallback(
    (item: Omit<CartItem, 'id' | 'itemPriceTotal'>) => {
      const unitPrice = calculateUnitPrice(item.menuItem.price, item.size);
      const itemPriceTotal = unitPrice * item.quantity;
      const cartItemId = buildCartItemId(
        item.menuItem.id,
        item.size,
        item.sugarLevel,
        item.iceLevel,
        item.note
      );

      setCart((previousCart) => {
        const existingItem = previousCart.find((entry) => entry.id === cartItemId);
        if (existingItem !== undefined) {
          return previousCart.map((entry) =>
            entry.id === cartItemId
              ? {
                  ...entry,
                  quantity: entry.quantity + item.quantity,
                  itemPriceTotal:
                    unitPrice * (entry.quantity + item.quantity),
                  note: item.note ?? entry.note
                }
              : entry
          );
        }
        return [
          ...previousCart,
          {
            id: cartItemId,
            menuItem: item.menuItem,
            quantity: item.quantity,
            size: item.size,
            sugarLevel: item.sugarLevel,
            iceLevel: item.iceLevel,
            itemPriceTotal,
            note: item.note
          }
        ];
      });
    },
    []
  );

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((previousCart) =>
      previousCart.flatMap((item) => {
        if (item.id !== cartItemId) return [item];
        const nextQuantity = item.quantity + delta;
        if (nextQuantity <= 0) return [];
        const unitPrice = calculateUnitPrice(item.menuItem.price, item.size);
        return [
          {
            ...item,
            quantity: nextQuantity,
            itemPriceTotal: unitPrice * nextQuantity
          }
        ];
      })
    );
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== cartItemId)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const openProductModal = useCallback((product: MenuItem) => {
    setSelectedProductForCustomization(product);
  }, []);

  const closeProductModal = useCallback(() => {
    setSelectedProductForCustomization(null);
  }, []);

  const totalItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.itemPriceTotal, 0),
    [cart]
  );

  const taxAmount = useMemo(
    () => Math.round(subtotal * TAX_RATE),
    [subtotal]
  );

  const grandTotal = subtotal + taxAmount;

  const contextValue = useMemo<CartContextValue>(
    () => ({
      cart,
      isCartOpen,
      selectedProductForCustomization,
      storeSettings,
      toastMessage,
      totalItemsCount,
      subtotal,
      taxAmount,
      grandTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      openProductModal,
      closeProductModal,
      showToast
    }),
    [
      cart,
      isCartOpen,
      selectedProductForCustomization,
      storeSettings,
      toastMessage,
      totalItemsCount,
      subtotal,
      taxAmount,
      grandTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      openProductModal,
      closeProductModal,
      showToast
    ]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
