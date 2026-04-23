"use client";

import { useState } from "react";
import { TimelineEvent as TimelineEventType } from "@/types/election";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { getEventStatus } from "../utils/timeline-helpers";

interface Props {
  event: TimelineEventType;
  onAddToCalendar: (event: TimelineEventType) => void;
}

export function TimelineEvent({ event, onAddToCalendar }: Props) {
  const [expanded, setExpanded] = useState(false);
  
  const now = new Date();
  const eventDate = new Date(event.date);
  const status = getEventStatus(event, now);

  const statusColors = {
    completed: "text-muted-foreground border-muted bg-white/5",
    ongoing: "text-green-400 border-green-400/50 bg-green-400/10 animate-pulse",
    upcoming: "text-primary border-primary/50 bg-white/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative pl-8 md:pl-0"
    >
      {/* Desktop Timeline Dot */}
      <div className={`hidden md:block absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background z-10 ${
        status === "ongoing" ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]" : 
        status === "completed" ? "bg-muted" : "bg-primary"
      }`} />
      
      {/* Mobile Timeline Dot */}
      <div className={`md:hidden absolute top-6 left-[-5px] w-3 h-3 rounded-full border-2 border-background z-10 ${
        status === "ongoing" ? "bg-green-400" : 
        status === "completed" ? "bg-muted" : "bg-primary"
      }`} />

      <Card className={`relative bg-card/60 backdrop-blur-md border-white/10 overflow-hidden transition-all duration-300 ${
        status === "completed" ? "opacity-60 grayscale-[0.5]" : 
        status === "ongoing" ? "ring-2 ring-green-400/30 bg-card/80 scale-[1.02] shadow-2xl shadow-green-400/10" : "hover:bg-card/70"
      }`}>
        <CardHeader 
          className="pb-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary" 
          onClick={() => setExpanded(!expanded)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setExpanded(!expanded);
            }
          }}
          tabIndex={0}
          role="button"
          aria-expanded={expanded}
          aria-controls={`event-details-${event.id}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className={statusColors[status]}>
                <span className="sr-only">Status: </span>{status.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-white/40 border-white/5 bg-white/5">
                <span className="sr-only">Phase: </span>{event.phase}
              </Badge>
            </div>
            <span className="text-sm font-medium text-muted-foreground" aria-label={`Date: ${eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}>
              {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              , 2026
            </span>
          </div>
          
          <div className="flex justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
              {event.states && (
                <div className="flex flex-wrap gap-1 mt-1" aria-label="Target states">
                  {event.states.map(state => (
                    <span key={state} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary-foreground font-bold">
                      {state}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 text-muted-foreground hover:text-white" aria-hidden="true">
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {expanded && (
            <motion.div
              id={`event-details-${event.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{event.description}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-6">
                  {event.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                      <span className="text-primary mt-1 font-bold">✓</span> {detail}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCalendar(event);
                  }}
                  variant="outline" 
                  className="w-full bg-white/5 border-white/10 hover:bg-primary/20 hover:text-white transition-all group"
                >
                  <CalendarPlus className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
                  Add to Google Calendar
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
