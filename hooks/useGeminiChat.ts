import { useState } from "react";
import { useChatStore } from "@/store/useChatStore";

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
      role: "model",
      content: "",
      createdAt: new Date(),
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to send message";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Fallback to status text
        }
        throw new Error(errorMessage);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        botResponse += chunk;
        updateLastMessage(botResponse);
      }
    } catch (err: any) {
      console.error(err);
      const userFriendlyError = err.message || "An error occurred while communicating with the AI. Please try again.";
      setError(userFriendlyError);
      updateLastMessage(`Error: ${userFriendlyError}`);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, error };
}
