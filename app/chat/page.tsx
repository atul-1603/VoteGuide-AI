"use client";

import { useGeminiChat } from "@/features/chat";
import { useChatStore } from "@/features/chat";
import { ChatWindow } from "@/features/chat";
import { ChatInput } from "@/features/chat";
import { QuickPrompts } from "@/features/chat";
import { AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";

export default function ChatPage() {
  const { sendMessage, error } = useGeminiChat();
  const { isLoading, clearMessages } = useChatStore();

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 md:p-8 mesh-bg h-[calc(100vh-4rem)]">
      {/* Sidebar for topics - hidden on small screens */}
      <aside className="hidden lg:flex w-64 flex-col gap-6" aria-label="Chat categories">
        <div>
          <h3 className="font-serif text-xl font-bold text-white mb-4">Categories</h3>
          <ul className="space-y-2 text-sm text-muted-foreground" role="list">
            {["Registration", "ID & Documents", "Polling Day", "EVM & Process", "Rights & Laws"].map((cat) => (
              <li key={cat}>
                <button
                  className="w-full text-left hover:text-primary cursor-pointer transition-colors px-3 py-2 bg-white/5 rounded-lg border border-white/5 focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => sendMessage(`Tell me about ${cat}`)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto">
          <Button variant="outline" className="w-full text-destructive border-white/10 hover:bg-destructive/20" onClick={clearMessages}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
          <p className="text-xs text-muted-foreground mt-4 flex items-start gap-2 bg-white/5 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            Responses are informational. Refer to ECI.gov.in for official info.
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full">
        <ChatWindow />
        
        <div className="mt-4 flex flex-col gap-4">
          <QuickPrompts onSelect={sendMessage} />
          {error && (
            <p className="text-sm text-destructive px-2" role="alert">{error}</p>
          )}
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
