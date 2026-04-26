"use client";

import { motion } from "framer-motion";
import { JourneyStep } from "@/types/election";
import { Card, CardContent } from "@/components/ui";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";

interface Props {
  step: JourneyStep;
  isCompleted: boolean;
  onToggle: (stepId: string) => void;
  index: number;
}

export function StepCard({ step, isCompleted, onToggle, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card 
        className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-white/10 focus-visible:ring-2 focus-visible:ring-primary outline-none ${
          isCompleted 
            ? "bg-primary/10 border-primary/30" 
            : "bg-card/40 backdrop-blur-sm hover:bg-card/60"
        }`}
        onClick={() => onToggle(step.id)}
        role="button"
        tabIndex={0}
        aria-pressed={isCompleted}
        aria-label={`Step ${step.order}: ${step.title}. ${isCompleted ? 'Completed' : 'Not completed'}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(step.id);
          }
        }}
      >
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCompleted ? "bg-primary" : "bg-white/10"}`} />
        
        <CardContent className="p-6 pl-8 flex items-start gap-4">
          <div className="shrink-0 mt-1">
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-primary" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded">Step {step.order}</span>
              <h3 className={`text-lg font-bold ${isCompleted ? "text-primary line-through opacity-70" : "text-white"}`}>
                {step.title}
              </h3>
            </div>
            
            <p className={`text-sm ${isCompleted ? "text-muted-foreground/70" : "text-muted-foreground"} mb-3`}>
              {step.description}
            </p>

            {step.externalLink && (
              <a 
                href={step.externalLink} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-secondary/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Go to Portal <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
