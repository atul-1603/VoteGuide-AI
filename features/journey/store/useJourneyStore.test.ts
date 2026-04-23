import { useJourneyStore } from './useJourneyStore';
import { act } from '@testing-library/react';

// Mock firebase db
jest.mock('@/lib/firebase', () => ({
  db: {}
}));

// Mock firestore functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

// Reset store between tests
const originalState = useJourneyStore.getState();

describe('useJourneyStore', () => {
  beforeEach(() => {
    useJourneyStore.setState(originalState);
  });

  it('toggles a step correctly', async () => {
    const stepId = 'register';
    const userId = 'user123';

    // Toggle on
    await act(async () => {
      await useJourneyStore.getState().toggleStep(userId, stepId);
    });
    expect(useJourneyStore.getState().completedSteps).toContain(stepId);

    // Toggle off
    await act(async () => {
      await useJourneyStore.getState().toggleStep(userId, stepId);
    });
    expect(useJourneyStore.getState().completedSteps).not.toContain(stepId);
  });
});
