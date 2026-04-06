import { create } from "zustand";

type UiState = {
  isMobileMenuOpen: boolean;
  isSearchFocused: boolean;
  isChatOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchFocused: (focused: boolean) => void;
  setChatOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isMobileMenuOpen: false,
  isSearchFocused: false,
  isChatOpen: false,
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setSearchFocused: (isSearchFocused) => set({ isSearchFocused }),
  setChatOpen: (isChatOpen) => set({ isChatOpen }),
}));
