import { create } from "zustand";

interface Toast {
  id: number;
  message: string;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string) => void;
}

let _seq = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message) => {
    const id = ++_seq;
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(
      () => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      2500,
    );
  },
}));
