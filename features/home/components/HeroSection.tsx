"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays } from "lucide-react";
import { timelineEvents } from "@/data/timeline";
import { TimelineEvent } from "@/types/election";
import { calculateTimeLeft } from "@/lib/date-utils";

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [targetEvent, setTargetEvent] = useState<TimelineEvent | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      
      // Find the next relevant event
      const nextEvent = timelineEvents.find(e => {
        const eventDate = new Date(e.date);
        const endDate = e.endDate ? new Date(e.endDate) : null;
        // If there's an end date, the event is relevant until it's over
        if (endDate) return now <= endDate;
        // Otherwise it's relevant until the event date
        return now <= eventDate;
      });

      if (!nextEvent) {
        setIsFinished(true);
        clearInterval(timer);
        return;
      }

      setTargetEvent(nextEvent);
      setIsFinished(false);

      const eventDate = new Date(nextEvent.date);
      const endDate = nextEvent.endDate ? new Date(nextEvent.endDate) : null;
      
      const isOngoing = endDate && now >= eventDate && now <= endDate;
      const targetTime = isOngoing ? endDate : eventDate;
      
      setTimeLeft(calculateTimeLeft(targetTime));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getLabel = () => {
    if (isFinished) return "Election process completed";
    if (!targetEvent) return "Loading schedule...";
    
    const now = new Date();
    const eventDate = new Date(targetEvent.date);
    const endDate = targetEvent.endDate ? new Date(targetEvent.endDate) : null;
    const isOngoing = endDate && now >= eventDate && now <= endDate;

    if (isOngoing) return `${targetEvent.title} ends in:`;
    return `Time left for ${targetEvent.title}`;
  };

  return (
    <section className="relative min-h-[90vh] flex items-center py-20 overflow-hidden mesh-bg">
      <div className="container relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          <motion.h1
            variants={itemVariants}
            className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] text-white drop-shadow-sm"
          >
            Know Your <span className="text-secondary">Vote.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-white/80 max-w-xl leading-relaxed"
          >
            Your intelligent guide to the democratic process. AI-powered insights, polling station finder, and a personalized voter journey.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-6 mt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 text-xl h-16 shadow-lg shadow-primary/25">
              <Link href="/chat">
                Chat with AI <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-10 text-xl h-16 border-white/20 hover:bg-white/10 hover:text-white text-white backdrop-blur-sm">
              <Link href="/timeline">View Timeline</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex justify-end items-center"
        >
          <div 
            className="w-full max-w-md p-10 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-primary/20 flex flex-col items-center gap-8 relative overflow-hidden group"
            role="timer"
            aria-live="polite"
            aria-label={`Countdown: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining for ${targetEvent?.title || 'next event'}`}
          >
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors" />
            
            <CalendarDays className="h-20 w-20 text-secondary drop-shadow-[0_0_15px_rgba(240,180,41,0.3)]" aria-hidden="true" />
            
            <div className="text-center w-full relative z-10">
              <h3 className="font-serif text-2xl font-bold text-white mb-8 min-h-[4rem] flex items-center justify-center px-4 leading-snug">
                {getLabel()}
              </h3>
              
              {!isFinished && (
                <div className="grid grid-cols-4 gap-4 sm:gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white/5 w-full py-4 rounded-2xl border border-white/5">
                      <span className="text-4xl font-bold text-white tabular-nums">{timeLeft.days}</span>
                    </div>
                    <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Days</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white/5 w-full py-4 rounded-2xl border border-white/5">
                      <span className="text-4xl font-bold text-white tabular-nums">{timeLeft.hours.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Hrs</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white/5 w-full py-4 rounded-2xl border border-white/5">
                      <span className="text-4xl font-bold text-white tabular-nums">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Min</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white/5 w-full py-4 rounded-2xl border border-white/5">
                      <span className="text-4xl font-bold text-white tabular-nums">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">Sec</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
