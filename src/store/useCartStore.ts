import { create } from "zustand";

export type CartVariant = {
  id: string;
  productId: string;
  name: string;
  thumbnail: string;
  sku: string;
  price: number;
  originalPrice: number;
  stock: number;
  attributes: Record<string, string>;
};

export type CartItem = {
  variant: CartVariant;
  quantity: number;
  selected: boolean;
};

type CartState = {
  items: CartItem[];
  voucherCode: string;
  setVoucherCode: (voucherCode: string) => void;
  addItem: (item: CartVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  toggleItem: (variantId: string) => void;
  toggleAll: (selected: boolean) => void;
  clearCart: () => void;
  selectedItems: () => CartItem[];
  subtotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  voucherCode: "",
  setVoucherCode: (voucherCode) => set({ voucherCode }),
  addItem: (item, quantity = 1) =>
    set((state) => {
      const existing = state.items.find(
        (cartItem) => cartItem.variant.id === item.id,
      );
      if (existing) {
        return {
          items: state.items.map((cartItem) =>
            cartItem.variant.id === item.id
              ? {
                  ...cartItem,
                  quantity: Math.min(cartItem.quantity + quantity, item.stock),
                }
              : cartItem,
          ),
        };
      }
      return {
        items: [...state.items, { variant: item, quantity, selected: true }],
      };
    }),
  removeItem: (variantId) =>
    set((state) => ({
      items: state.items.filter((item) => item.variant.id !== variantId),
    })),
  updateQuantity: (variantId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.variant.id === variantId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.variant.stock)),
            }
          : item,
      ),
    })),
  toggleItem: (variantId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.variant.id === variantId
          ? { ...item, selected: !item.selected }
          : item,
      ),
    })),
  toggleAll: (selected) =>
    set((state) => ({
      items: state.items.map((item) => ({ ...item, selected })),
    })),
  clearCart: () => set({ items: [], voucherCode: "" }),
  selectedItems: () => get().items.filter((item) => item.selected),
  subtotal: () =>
    get().items.reduce(
      (sum, item) =>
        item.selected ? sum + item.quantity * item.variant.price : sum,
      0,
    ),
}));
