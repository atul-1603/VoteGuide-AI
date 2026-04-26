import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { GeminiService } from "../services/gemini.service";

export function useGeminiChat() {
  const { messages, addMessage, updateLastMessage, setLoading, isLoading } = useChatStore();
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    setLoading(true);

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content,
      createdAt: new Date(),
    };

    addMessage(userMessage);

    const botMessageId = (Date.now() + 1).toString();
    addMessage({
      id: botMessageId,
      role: "model" as const,
      content: "",
      createdAt: new Date(),
    });

    try {
      let botResponse = "";
      const stream = GeminiService.streamChat([...messages, userMessage]);

      for await (const chunk of stream) {
        botResponse += chunk;
        updateLastMessage(botResponse);
      }
    } catch (err: unknown) {
      console.error("Chat Error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      const userFriendlyError = `Error: ${errorMessage}`;
      
      setError(errorMessage);
      updateLastMessage(userFriendlyError);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, error };
}
