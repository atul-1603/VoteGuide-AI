import { Message } from "@/types/election";
import { Vote, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MessageBubble({ message }: { message: Message }) {
  const isModel = message.role === "model";

  return (
    <div className={`flex gap-4 ${isModel ? "" : "flex-row-reverse"}`}>
      <div
        className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
          isModel ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
        }`}
      >
        {isModel ? <Vote className="w-5 h-5" aria-hidden="true" /> : <User className="w-5 h-5" aria-hidden="true" />}
      </div>
      <div
        className={`px-4 py-3 rounded-2xl max-w-[85%] ${
          isModel
            ? "bg-card/80 border border-white/5 text-foreground rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        }`}
      >
        {isModel ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </div>
  );
}
