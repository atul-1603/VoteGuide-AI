import { getEventStatus } from './timeline-helpers';
import { TimelineEvent } from '@/types/election';

describe('timeline-helpers', () => {
  const mockEvent: TimelineEvent = {
    id: '1',
    title: 'Test Event',
    date: '2026-05-01',
    description: 'Test',
    phase: 'Phase 1',
    details: [],
  };

  describe('getEventStatus', () => {
    // ─── Single-day events ──────────────────────────────────────

    it('returns "upcoming" for future events', () => {
      const now = new Date('2026-04-01');
      expect(getEventStatus(mockEvent, now)).toBe('upcoming');
    });

    it('returns "completed" for past events', () => {
      const now = new Date('2026-06-01');
      expect(getEventStatus(mockEvent, now)).toBe('completed');
    });

    it('returns "ongoing" for events happening today', () => {
      const now = new Date('2026-05-01T12:00:00');
      expect(getEventStatus(mockEvent, now)).toBe('ongoing');
    });

    it('returns "upcoming" when now is exactly midnight before event date', () => {
      const now = new Date('2026-04-30T23:59:59');
      expect(getEventStatus(mockEvent, now)).toBe('upcoming');
    });

    it('returns "completed" for event the day after', () => {
      const now = new Date('2026-05-02T00:00:00');
      expect(getEventStatus(mockEvent, now)).toBe('completed');
    });

    // ─── Multi-day events ───────────────────────────────────────

    it('returns "ongoing" for multi-day events within range', () => {
      const multiDayEvent: TimelineEvent = {
        ...mockEvent,
        endDate: '2026-05-05',
      };
      const now = new Date('2026-05-03');
      expect(getEventStatus(multiDayEvent, now)).toBe('ongoing');
    });

    it('returns "ongoing" at start boundary of multi-day event', () => {
      const multiDayEvent: TimelineEvent = {
        ...mockEvent,
        endDate: '2026-05-05',
      };
      const now = new Date('2026-05-01T12:00:00');
      expect(getEventStatus(multiDayEvent, now)).toBe('ongoing');
    });

    it('returns "ongoing" at end boundary of multi-day event', () => {
      const multiDayEvent: TimelineEvent = {
        ...mockEvent,
        endDate: '2026-05-05',
      };
      const now = new Date('2026-05-05T00:00:00');
      expect(getEventStatus(multiDayEvent, now)).toBe('ongoing');
    });

    it('returns "completed" after endDate of multi-day event', () => {
      const multiDayEvent: TimelineEvent = {
        ...mockEvent,
        endDate: '2026-05-05',
      };
      const now = new Date('2026-05-06');
      expect(getEventStatus(multiDayEvent, now)).toBe('completed');
    });

    it('returns "upcoming" before start of multi-day event', () => {
      const multiDayEvent: TimelineEvent = {
        ...mockEvent,
        endDate: '2026-05-05',
      };
      const now = new Date('2026-04-30');
      expect(getEventStatus(multiDayEvent, now)).toBe('upcoming');
    });

    // ─── Default behavior ───────────────────────────────────────

    it('uses current date as default when no "now" provided', () => {
      const farFutureEvent: TimelineEvent = {
        ...mockEvent,
        date: '2099-12-31',
      };
      expect(getEventStatus(farFutureEvent)).toBe('upcoming');
    });

    it('uses current date as default - past event', () => {
      const farPastEvent: TimelineEvent = {
        ...mockEvent,
        date: '2000-01-01',
      };
      expect(getEventStatus(farPastEvent)).toBe('completed');
    });
  });
});
