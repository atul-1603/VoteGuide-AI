import { calculateTimeLeft, formatTimeLeft } from './date-utils';

describe('date-utils', () => {
  describe('calculateTimeLeft', () => {
    it('calculates correct time remaining for a future date', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      jest.useFakeTimers().setSystemTime(now);
      
      const targetDate = new Date('2026-01-02T02:30:45Z');
      const timeLeft = calculateTimeLeft(targetDate);
      
      expect(timeLeft.days).toBe(1);
      expect(timeLeft.hours).toBe(2);
      expect(timeLeft.minutes).toBe(30);
      expect(timeLeft.seconds).toBe(45);
      
      jest.useRealTimers();
    });

    it('returns zero for past dates', () => {
      const pastDate = new Date('2020-01-01');
      const timeLeft = calculateTimeLeft(pastDate);
      
      expect(timeLeft).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    });

    it('returns zero when target is exactly now', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      jest.useFakeTimers().setSystemTime(now);

      const timeLeft = calculateTimeLeft(new Date('2026-01-01T00:00:00Z'));
      expect(timeLeft).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      jest.useRealTimers();
    });

    it('handles very large differences (100+ days)', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      jest.useFakeTimers().setSystemTime(now);

      const targetDate = new Date('2026-06-01T00:00:00Z');
      const timeLeft = calculateTimeLeft(targetDate);

      expect(timeLeft.days).toBe(151); // Jan has 31, Feb has 28, Mar has 31, Apr has 30, May has 31
      expect(timeLeft.hours).toBe(0);
      expect(timeLeft.minutes).toBe(0);

      jest.useRealTimers();
    });

    it('handles 1 second difference correctly', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      jest.useFakeTimers().setSystemTime(now);

      const targetDate = new Date('2026-01-01T00:00:01Z');
      const timeLeft = calculateTimeLeft(targetDate);

      expect(timeLeft).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 });

      jest.useRealTimers();
    });

    it('wraps hours correctly at 24', () => {
      const now = new Date('2026-01-01T00:00:00Z');
      jest.useFakeTimers().setSystemTime(now);

      const targetDate = new Date('2026-01-02T12:00:00Z');
      const timeLeft = calculateTimeLeft(targetDate);

      expect(timeLeft.days).toBe(1);
      expect(timeLeft.hours).toBe(12);
      expect(timeLeft.minutes).toBe(0);

      jest.useRealTimers();
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

    it('only includes non-zero parts', () => {
      expect(formatTimeLeft({ days: 0, hours: 3, minutes: 0, seconds: 0 })).toBe('3 hours');
      expect(formatTimeLeft({ days: 1, hours: 0, minutes: 0, seconds: 0 })).toBe('1 days');
      expect(formatTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 45 })).toBe('45 seconds');
    });

    it('includes all parts when all non-zero', () => {
      const timeLeft = { days: 1, hours: 2, minutes: 3, seconds: 4 };
      expect(formatTimeLeft(timeLeft)).toBe('1 days, 2 hours, 3 minutes, 4 seconds');
    });

    it('handles days + seconds with no hours or minutes', () => {
      const timeLeft = { days: 5, hours: 0, minutes: 0, seconds: 30 };
      expect(formatTimeLeft(timeLeft)).toBe('5 days, 30 seconds');
    });
  });
});
