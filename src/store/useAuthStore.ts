import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthStoreState {
  user: User | null;
  /** True until the first auth state resolves. */
  loading: boolean;
  init: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  loading: true,

  init: () => {
    try {
      return onAuthStateChanged(auth, (user) => set({ user, loading: false }));
    } catch (err) {
      console.warn("Auth initialization failed:", err);
      set({ user: null, loading: false });
      return () => {};
    }
  },

  signIn: async (email, password) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  },

  signOut: async () => {
    await fbSignOut(auth);
  },
}));
