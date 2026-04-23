"use client";

import { motion } from "framer-motion";

interface Props {
  total: number;
  completed: number;
}

export function JourneyProgress({ total, completed }: Props) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl mb-12">
      <div className="relative flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-white/10"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-primary drop-shadow-[0_0_8px_rgba(26,86,219,0.5)]"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-serif text-3xl font-bold text-white">{percentage}%</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Complete</span>
        </div>
      </div>
      <p className="mt-6 text-white/80 font-medium">
        You&apos;ve completed <span className="text-primary font-bold">{completed}</span> out of <span className="text-white font-bold">{total}</span> steps.
      </p>
    </div>
  );
}
