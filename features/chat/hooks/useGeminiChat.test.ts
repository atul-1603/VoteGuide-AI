import { renderHook, act } from '@testing-library/react';
import { useGeminiChat } from './useGeminiChat';
import { useChatStore } from '../store/useChatStore';
import { GeminiService } from '../services/gemini.service';

// Mock the store
jest.mock('../store/useChatStore');
// Mock the service
jest.mock('../services/gemini.service');

describe('useGeminiChat', () => {
  const mockAddMessage = jest.fn();
  const mockUpdateLastMessage = jest.fn();
  const mockSetLoading = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      messages: [],
      addMessage: mockAddMessage,
      updateLastMessage: mockUpdateLastMessage,
      setLoading: mockSetLoading,
      isLoading: false,
    });
  });

  it('sends a message and updates the store with chunks', async () => {
    const mockStream = (async function* () {
      yield 'Hello';
      yield ' world';
    })();
    (GeminiService.streamChat as jest.Mock).mockReturnValue(mockStream);

    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    expect(mockAddMessage).toHaveBeenCalledTimes(2); // User message + Initial empty Bot message
    expect(mockUpdateLastMessage).toHaveBeenCalledWith('Hello');
    expect(mockUpdateLastMessage).toHaveBeenCalledWith('Hello world');
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('handles errors gracefully', async () => {
    (GeminiService.streamChat as jest.Mock).mockImplementation(() => {
      throw new Error('API Error');
    });

    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    expect(result.current.error).toBe('API Error');
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });
});
