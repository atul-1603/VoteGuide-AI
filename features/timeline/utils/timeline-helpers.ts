import { TimelineEvent } from "@/types/election";

export type EventStatus = "completed" | "ongoing" | "upcoming";

/**
 * Calculates the status of a timeline event based on the current date.
 */
export function getEventStatus(event: TimelineEvent, now: Date = new Date()): EventStatus {
  const eventDate = new Date(event.date);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  if (endDate) {
    if (now > endDate) return "completed";
    if (now >= eventDate && now <= endDate) return "ongoing";
    return "upcoming";
  }

  if (now > eventDate) {
    const isToday = eventDate.toDateString() === now.toDateString();
    return isToday ? "ongoing" : "completed";
  }

  return "upcoming";
}
