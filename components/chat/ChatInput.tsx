"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-card/50 backdrop-blur-md border border-white/10 p-2 rounded-2xl flex items-end gap-2 shadow-xl">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about voting..."
        className="min-h-[44px] max-h-32 resize-none border-0 bg-transparent focus-visible:ring-0 px-4 py-3 text-white placeholder:text-muted-foreground"
        rows={1}
      />
      <div className="flex gap-2 pb-1 pr-1 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-white hover:bg-white/10 rounded-full"
          title="Voice input (coming soon)"
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading}
          className="bg-primary hover:bg-primary/90 text-white rounded-full transition-all"
        >
          <Send className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </form>
  );
}
