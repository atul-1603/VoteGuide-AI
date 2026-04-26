import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './useCountdown';
import { calculateTimeLeft } from '@/lib/utils/date-utils';

// We must mock the timeline data to control test conditions
jest.mock('@/config/constants/timeline', () => ({
  timelineEvents: [
    {
      id: '1',
      title: 'Past Event',
      date: '2025-01-01',
      description: 'Already happened',
      phase: 'Phase 1',
      details: [],
    },
    {
      id: '2',
      title: 'Ongoing Event',
      date: '2026-04-01',
      endDate: '2026-06-01',
      description: 'Currently active',
      phase: 'Phase 2',
      details: [],
    },
    {
      id: '3',
      title: 'Future Event',
      date: '2026-12-01',
      description: 'Still to come',
      phase: 'Phase 3',
      details: [],
    },
  ],
}));

jest.mock('@/lib/utils/date-utils', () => ({
  calculateTimeLeft: jest.fn(() => ({
    days: 10,
    hours: 5,
    minutes: 30,
    seconds: 15,
  })),
}));

describe('useCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Set "now" to a date within the ongoing event range
    jest.setSystemTime(new Date('2026-05-01T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts with mounted = false and becomes true after effect runs', () => {
    const { result } = renderHook(() => useCountdown());

    // After render + effect, mounted should be true
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.mounted).toBe(true);
  });

  it('identifies the first non-past event as the target', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      jest.advanceTimersByTime(0);
    });

    // The ongoing event should be found because now (2026-05-01) is within its date range
    expect(result.current.targetEvent).not.toBeNull();
    expect(result.current.targetEvent?.title).toBe('Ongoing Event');
  });

  it('detects ongoing events correctly', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.isOngoing).toBe(true);
    expect(result.current.isFinished).toBe(false);
  });

  it('returns timeLeft from calculateTimeLeft', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.timeLeft).toEqual({
      days: 10,
      hours: 5,
      minutes: 30,
      seconds: 15,
    });
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = renderHook(() => useCountdown());

    act(() => {
      jest.advanceTimersByTime(0);
    });

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('updates on each interval tick', () => {
    renderHook(() => useCountdown());

    act(() => {
      jest.advanceTimersByTime(0); // initial call
    });

    const mockedCalculateTimeLeft = calculateTimeLeft as jest.Mock;
    const callCountAfterInit = mockedCalculateTimeLeft.mock.calls.length;

    act(() => {
      jest.advanceTimersByTime(1000); // one tick
    });

    expect(mockedCalculateTimeLeft.mock.calls.length).toBeGreaterThan(callCountAfterInit);
  });
});

describe('useCountdown — all events completed', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Set "now" far in the future, past all events
    jest.setSystemTime(new Date('2099-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sets isFinished when all events are past', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.isFinished).toBe(true);
    expect(result.current.targetEvent).toBeNull();
    expect(result.current.isOngoing).toBe(false);
  });
});
