"use client";

import { useState } from "react";
import { TimelineEvent as TimelineEventType } from "@/types/election";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  event: TimelineEventType;
  onAddToCalendar: (event: TimelineEventType) => void;
}

export function TimelineEvent({ event, onAddToCalendar }: Props) {
  const [expanded, setExpanded] = useState(false);
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative pl-8 md:pl-0"
    >
      {/* Desktop Timeline Dot */}
      <div className="hidden md:block absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
      
      {/* Mobile Timeline Dot */}
      <div className="md:hidden absolute top-6 left-[-5px] w-3 h-3 rounded-full bg-primary border-2 border-background z-10" />

      <Card className={`relative bg-card/60 backdrop-blur-md border-white/10 overflow-hidden ${isPast ? "opacity-75" : ""}`}>
        <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className={`${isPast ? "text-muted-foreground border-muted" : "text-primary border-primary/50"} bg-white/5`}>
              {event.phase}
            </Badge>
            <span className="text-sm font-medium text-muted-foreground">
              {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-white">{event.title}</h3>
            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-white">
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">{event.description}</p>
                <ul className="space-y-2 mb-6">
                  {event.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-primary mt-1">•</span> {detail}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCalendar(event);
                  }}
                  variant="outline" 
                  className="w-full bg-white/5 border-white/10 hover:bg-primary/20 hover:text-white transition-colors"
                >
                  <CalendarPlus className="w-4 h-4 mr-2 text-primary" />
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
