import { create } from "zustand";

interface UIState {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  musicPlaying: boolean;
  toggleMusic: () => void;
  setMusicPlaying: (playing: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),

  searchOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),

  musicPlaying: false,
  toggleMusic: () => set((s) => ({ musicPlaying: !s.musicPlaying })),
  setMusicPlaying: (playing: boolean) => set({ musicPlaying: playing }),
}));
