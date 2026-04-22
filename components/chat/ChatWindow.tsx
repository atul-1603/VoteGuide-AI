"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatWindow() {
  const { messages, isLoading } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col h-full bg-card/30 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="font-semibold text-white">VoteGuide Assistant</h2>
        </div>
        <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">Gemini 2.0 Flash</span>
      </div>
      
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>
    </div>
  );
}
