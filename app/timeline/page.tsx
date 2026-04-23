"use client";

import { useState } from "react";
import { timelineEvents } from "@/data/timeline";
import { TimelineEvent } from "@/features/timeline/components/TimelineEvent";
import { TimelineEvent as TimelineEventType } from "@/types/election";
import { useCalendarAuth } from "@/features/timeline/hooks/useCalendarAuth";
import { Button } from "@/components/ui/button";

const PHASES = ["All", "Registration", "Campaigning", "Polling", "Results"];

export default function TimelinePage() {
  const [filter, setFilter] = useState("All");
  const { requestToken, accessToken } = useCalendarAuth();
  const [pendingEvent, setPendingEvent] = useState<TimelineEventType | null>(null);

  const filteredEvents = filter === "All" 
    ? timelineEvents 
    : timelineEvents.filter(e => e.phase === filter);

  const handleAddToCalendar = async (event: TimelineEventType) => {
    if (!accessToken) {
      setPendingEvent(event);
      requestToken();
      return;
    }

    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle: event.title,
          date: event.date,
          description: event.description,
          accessToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.open(data.eventLink, "_blank");
      } else {
        console.error("Failed to add to calendar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // If token was just received and we have a pending event, process it
  if (accessToken && pendingEvent) {
    handleAddToCalendar(pendingEvent);
    setPendingEvent(null);
  }

  return (
    <div className="flex-1 bg-background py-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="container max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Election Timeline</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with our comprehensive schedule of the upcoming elections. Track phases, deadlines, and results.
          </p>
        </div>

        {/* Phase Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 sticky top-20 z-20 bg-background/80 backdrop-blur-md py-4 rounded-full border border-white/5">
          {PHASES.map((phase) => (
            <Button
              key={phase}
              variant={filter === phase ? "default" : "ghost"}
              className={`rounded-full ${filter === phase ? "bg-primary text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}
              onClick={() => setFilter(phase)}
            >
              {phase}
            </Button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Main vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2" />
          
          {/* Main vertical line for mobile */}
          <div className="md:hidden absolute left-0 top-0 bottom-0 w-[2px] bg-white/10" />

          <div className="space-y-12">
            {filteredEvents.map((event, index) => {
              const isNextUpcoming = event.id === filteredEvents.find(e => new Date(e.date) > new Date())?.id;
              return (
                <div key={event.id} className={`flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block flex-1" />
                  
                  {/* Event Card */}
                  <div className="flex-1">
                    <div className={isNextUpcoming ? "ring-2 ring-primary/50 rounded-lg p-1 animate-pulse" : ""}>
                      <TimelineEvent event={event} onAddToCalendar={handleAddToCalendar} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
