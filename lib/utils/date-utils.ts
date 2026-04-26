export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculates time remaining until a target date.
 */
export function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

/**
 * Formats a TimeLeft object into a readable string.
 */
export function formatTimeLeft(timeLeft: TimeLeft): string {
  const parts = [];
  if (timeLeft.days > 0) parts.push(`${timeLeft.days} days`);
  if (timeLeft.hours > 0) parts.push(`${timeLeft.hours} hours`);
  if (timeLeft.minutes > 0) parts.push(`${timeLeft.minutes} minutes`);
  if (timeLeft.seconds > 0) parts.push(`${timeLeft.seconds} seconds`);
  
  return parts.length > 0 ? parts.join(", ") : "0 seconds";
}
