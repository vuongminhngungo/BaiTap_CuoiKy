import { create } from "zustand";

type ToastState = {
  id: number;
  title: string;
  description?: string;
};

type UiState = {
  isMobileMenuOpen: boolean;
  isSearchFocused: boolean;
  isChatOpen: boolean;
  toast: ToastState | null;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchFocused: (focused: boolean) => void;
  setChatOpen: (open: boolean) => void;
  showToast: (toast: Omit<ToastState, "id">) => void;
  clearToast: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isMobileMenuOpen: false,
  isSearchFocused: false,
  isChatOpen: false,
  toast: null,
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setSearchFocused: (isSearchFocused) => set({ isSearchFocused }),
  setChatOpen: (isChatOpen) => set({ isChatOpen }),
  showToast: (toast) =>
    set({
      toast: {
        id: Date.now(),
        title: toast.title,
        description: toast.description,
      },
    }),
  clearToast: () => set({ toast: null }),
}));
