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

    it('returns "ongoing" for multi-day events within range', () => {
      const multiDayEvent: TimelineEvent = {
        ...mockEvent,
        endDate: '2026-05-05',
      };
      const now = new Date('2026-05-03');
      expect(getEventStatus(multiDayEvent, now)).toBe('ongoing');
    });
  });
});
