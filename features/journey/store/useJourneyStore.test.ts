import { useJourneyStore } from './useJourneyStore';
import { act } from '@testing-library/react';
import { getDoc, setDoc } from 'firebase/firestore';

// Mock firebase db
jest.mock('@/services/firebase', () => ({
  db: {}
}));

// Mock firestore functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

const mockGetDoc = getDoc as jest.Mock;
const mockSetDoc = setDoc as jest.Mock;

describe('useJourneyStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useJourneyStore.setState({ completedSteps: [], isLoading: false });
  });

  // ─── toggleStep ────────────────────────────────────────────────

  describe('toggleStep', () => {
    it('adds a step when not already completed', async () => {
      mockSetDoc.mockResolvedValue(undefined);

      await act(async () => {
        await useJourneyStore.getState().toggleStep('user1', 'register');
      });

      expect(useJourneyStore.getState().completedSteps).toContain('register');
    });

    it('removes a step when already completed', async () => {
      useJourneyStore.setState({ completedSteps: ['register'] });
      mockSetDoc.mockResolvedValue(undefined);

      await act(async () => {
        await useJourneyStore.getState().toggleStep('user1', 'register');
      });

      expect(useJourneyStore.getState().completedSteps).not.toContain('register');
    });

    it('does nothing when userId is empty', async () => {
      await act(async () => {
        await useJourneyStore.getState().toggleStep('', 'register');
      });

      expect(useJourneyStore.getState().completedSteps).toEqual([]);
      expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('reverts on Firestore write failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      useJourneyStore.setState({ completedSteps: ['step1'] });
      mockSetDoc.mockRejectedValue(new Error('Write failed'));

      await act(async () => {
        await useJourneyStore.getState().toggleStep('user1', 'step2');
      });

      // Should revert to original state (only step1)
      expect(useJourneyStore.getState().completedSteps).toEqual(['step1']);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('preserves other steps when toggling one', async () => {
      useJourneyStore.setState({ completedSteps: ['step1', 'step2'] });
      mockSetDoc.mockResolvedValue(undefined);

      await act(async () => {
        await useJourneyStore.getState().toggleStep('user1', 'step3');
      });

      const steps = useJourneyStore.getState().completedSteps;
      expect(steps).toContain('step1');
      expect(steps).toContain('step2');
      expect(steps).toContain('step3');
    });
  });

  // ─── fetchProgress ─────────────────────────────────────────────

  describe('fetchProgress', () => {
    it('loads completed steps from Firestore', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ completedSteps: ['step1', 'step2'] }),
      });

      await act(async () => {
        await useJourneyStore.getState().fetchProgress('user1');
      });

      expect(useJourneyStore.getState().completedSteps).toEqual(['step1', 'step2']);
      expect(useJourneyStore.getState().isLoading).toBe(false);
    });

    it('sets empty array when document does not exist', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
        data: () => null,
      });

      await act(async () => {
        await useJourneyStore.getState().fetchProgress('user1');
      });

      expect(useJourneyStore.getState().completedSteps).toEqual([]);
    });

    it('does nothing when userId is empty', async () => {
      await act(async () => {
        await useJourneyStore.getState().fetchProgress('');
      });

      expect(mockGetDoc).not.toHaveBeenCalled();
      expect(useJourneyStore.getState().isLoading).toBe(false);
    });

    it('sets isLoading during fetch', async () => {
      let loadingDuringFetch = false;
      mockGetDoc.mockImplementation(() => {
        loadingDuringFetch = useJourneyStore.getState().isLoading;
        return Promise.resolve({
          exists: () => true,
          data: () => ({ completedSteps: [] }),
        });
      });

      await act(async () => {
        await useJourneyStore.getState().fetchProgress('user1');
      });

      expect(loadingDuringFetch).toBe(true);
      expect(useJourneyStore.getState().isLoading).toBe(false);
    });

    it('handles Firestore read errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGetDoc.mockRejectedValue(new Error('Network error'));

      await act(async () => {
        await useJourneyStore.getState().fetchProgress('user1');
      });

      expect(useJourneyStore.getState().isLoading).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('defaults to empty array when completedSteps is undefined in doc', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({}), // No completedSteps field
      });

      await act(async () => {
        await useJourneyStore.getState().fetchProgress('user1');
      });

      expect(useJourneyStore.getState().completedSteps).toEqual([]);
    });
  });
});
