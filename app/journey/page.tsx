"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useJourneyStore } from "@/store/useJourneyStore";
import { journeySteps } from "@/data/journey-steps";
import { JourneyProgress } from "@/components/journey/JourneyProgress";
import { StepCard } from "@/components/journey/StepCard";
import { CompletionCelebration } from "@/components/journey/CompletionCelebration";
import { ShareCard } from "@/components/journey/ShareCard";

export default function JourneyPage() {
  const { user } = useAuthStore();
  const { completedSteps, fetchProgress, toggleStep } = useJourneyStore();

  useEffect(() => {
    if (user?.uid) {
      fetchProgress(user.uid);
    }
  }, [user, fetchProgress]);

  if (!user) return null; // Middleware handles redirect

  const isFullyCompleted = completedSteps.length === journeySteps.length;

  return (
    <div className="flex-1 bg-background py-12 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-50 pointer-events-none" />
      
      <div className="container max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Your Voter Journey</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow this step-by-step checklist to ensure you are fully prepared to cast your ballot.
          </p>
        </div>

        {/* Progress Ring */}
        <div className="flex justify-center">
          <JourneyProgress total={journeySteps.length} completed={completedSteps.length} />
        </div>

        {/* Steps List */}
        <div className="space-y-4 mb-16 relative">
          {journeySteps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              isCompleted={completedSteps.includes(step.id)}
              onToggle={(id) => toggleStep(user.uid, id)}
            />
          ))}
        </div>

        {/* Completion State */}
        {isFullyCompleted && (
          <>
            <CompletionCelebration isCompleted={isFullyCompleted} />
            <ShareCard userName={user.displayName || "Citizen"} />
          </>
        )}
      </div>
    </div>
  );
}
