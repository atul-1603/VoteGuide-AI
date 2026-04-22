import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface JourneyState {
  completedSteps: string[];
  isLoading: boolean;
  fetchProgress: (userId: string) => Promise<void>;
  toggleStep: (userId: string, stepId: string) => Promise<void>;
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  completedSteps: [],
  isLoading: false,
  
  fetchProgress: async (userId) => {
    if (!userId) return;
    set({ isLoading: true });
    try {
      const docRef = doc(db, "users", userId, "journey", "progress");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ completedSteps: docSnap.data().completedSteps || [] });
      } else {
        set({ completedSteps: [] });
      }
    } catch (error) {
      console.error("Error fetching journey progress:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleStep: async (userId, stepId) => {
    if (!userId) return;
    const { completedSteps } = get();
    
    let newSteps = [...completedSteps];
    if (newSteps.includes(stepId)) {
      newSteps = newSteps.filter((id) => id !== stepId);
    } else {
      newSteps.push(stepId);
    }
    
    // Optimistic update
    set({ completedSteps: newSteps });

    try {
      const docRef = doc(db, "users", userId, "journey", "progress");
      await setDoc(docRef, { completedSteps: newSteps }, { merge: true });
    } catch (error) {
      console.error("Error updating journey progress:", error);
      // Revert on failure
      set({ completedSteps });
    }
  },
}));
