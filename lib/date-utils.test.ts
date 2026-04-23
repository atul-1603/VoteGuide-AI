import { calculateTimeLeft, formatTimeLeft } from './date-utils';

describe('date-utils', () => {
  describe('calculateTimeLeft', () => {
    it('calculates correct time remaining for a future date', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      jest.useFakeTimers().setSystemTime(now);
      
      const targetDate = new Date('2026-01-02T02:30:00Z');
      const timeLeft = calculateTimeLeft(targetDate);
      
      expect(timeLeft.days).toBe(1);
      expect(timeLeft.hours).toBe(2);
      expect(timeLeft.minutes).toBe(30);
      
      jest.useRealTimers();
    });

    it('returns zero for past dates', () => {
      const pastDate = new Date('2020-01-01');
      const timeLeft = calculateTimeLeft(pastDate);
      
      expect(timeLeft).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    });
  });

  describe('formatTimeLeft', () => {
    it('formats days, hours, minutes correctly', () => {
      const timeLeft = { days: 2, hours: 5, minutes: 30, seconds: 0 };
      expect(formatTimeLeft(timeLeft)).toBe('2 days, 5 hours, 30 minutes');
    });

    it('returns 0 seconds for zero time', () => {
      const timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      expect(formatTimeLeft(timeLeft)).toBe('0 seconds');
    });
  });
});
