import { create } from "zustand";
import { User, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/services/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  },
  logOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  },
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));
