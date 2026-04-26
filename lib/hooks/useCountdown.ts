import { useState, useEffect } from "react";
import { timelineEvents } from "@/config/constants/timeline";
import { TimelineEvent } from "@/types/election";
import { calculateTimeLeft, type TimeLeft } from "@/lib/utils/date-utils";

interface UseCountdownReturn {
  timeLeft: TimeLeft;
  targetEvent: TimelineEvent | null;
  isFinished: boolean;
  isOngoing: boolean;
  mounted: boolean;
}

/**
 * Shared countdown hook that finds the next relevant timeline event
 * and provides a live-updating countdown timer.
 *
 * Handles hydration safety via a `mounted` flag.
 */
export function useCountdown(): UseCountdownReturn {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetEvent, setTargetEvent] = useState<TimelineEvent | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isOngoing, setIsOngoing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateCountdown = () => {
      const now = new Date();

      const nextEvent = timelineEvents.find((e) => {
        const eventDate = new Date(e.date);
        const endDate = e.endDate ? new Date(e.endDate) : null;
        if (endDate) return now <= endDate;
        return now <= eventDate;
      });

      if (!nextEvent) {
        setIsFinished(true);
        setTargetEvent(null);
        setIsOngoing(false);
        return;
      }

      setTargetEvent(nextEvent);
      setIsFinished(false);

      const eventDate = new Date(nextEvent.date);
      const endDate = nextEvent.endDate ? new Date(nextEvent.endDate) : null;
      const ongoing = Boolean(endDate && now >= eventDate && now <= endDate);

      setIsOngoing(ongoing);
      const targetTime = ongoing && endDate ? endDate : eventDate;
      setTimeLeft(calculateTimeLeft(targetTime));
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, []);

  return { timeLeft, targetEvent, isFinished, isOngoing, mounted };
}
