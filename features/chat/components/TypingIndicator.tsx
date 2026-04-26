import { motion } from "framer-motion";

interface Props {
  "aria-label"?: string;
}

export function TypingIndicator({ "aria-label": ariaLabel }: Props) {
  return (
    <div className="flex gap-4" aria-label={ariaLabel || "Assistant is typing"} role="status" aria-live="polite">
      <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-primary/20 text-primary" aria-hidden="true">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="px-4 py-4 rounded-2xl bg-card/80 border border-white/5 rounded-tl-sm flex items-center gap-1">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
          className="w-2 h-2 rounded-full bg-muted-foreground"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-muted-foreground"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-muted-foreground"
        />
      </div>
    </div>
  );
}
