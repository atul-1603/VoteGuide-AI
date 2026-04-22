import { create } from "zustand";
import { Message } from "@/types/election";

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: "initial",
      role: "model",
      content: "Hello! I am VoteGuide, your AI election assistant. How can I help you today? You can ask me about voter registration, polling stations, ID requirements, or election laws.",
      createdAt: new Date(),
    },
  ],
  isLoading: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      if (messages.length > 0) {
        messages[messages.length - 1].content = content;
      }
      return { messages };
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () =>
    set({
      messages: [
        {
          id: "initial",
          role: "model",
          content: "Hello! I am VoteGuide, your AI election assistant. How can I help you today?",
          createdAt: new Date(),
        },
      ],
    }),
}));
