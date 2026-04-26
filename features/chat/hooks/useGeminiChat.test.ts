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

  const setupMockStore = (overrides = {}) => {
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      messages: [],
      addMessage: mockAddMessage,
      updateLastMessage: mockUpdateLastMessage,
      setLoading: mockSetLoading,
      isLoading: false,
      ...overrides,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockStore();
  });

  // ─── Successful message flow ──────────────────────────────────

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

  it('adds user message with correct structure', async () => {
    const mockStream = (async function* () {
      yield 'response';
    })();
    (GeminiService.streamChat as jest.Mock).mockReturnValue(mockStream);

    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('Hello there');
    });

    const userMsg = mockAddMessage.mock.calls[0][0];
    expect(userMsg.role).toBe('user');
    expect(userMsg.content).toBe('Hello there');
    expect(userMsg.id).toBeDefined();
    expect(userMsg.createdAt).toBeInstanceOf(Date);
  });

  it('adds empty bot message placeholder', async () => {
    const mockStream = (async function* () {
      yield 'test';
    })();
    (GeminiService.streamChat as jest.Mock).mockReturnValue(mockStream);

    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    const botMsg = mockAddMessage.mock.calls[1][0];
    expect(botMsg.role).toBe('model');
    expect(botMsg.content).toBe('');
  });

  it('sets loading true at start and false at end', async () => {
    const mockStream = (async function* () {
      yield 'ok';
    })();
    (GeminiService.streamChat as jest.Mock).mockReturnValue(mockStream);

    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    // Loading(true) should be called before loading(false)
    const calls = mockSetLoading.mock.calls.map((c: [boolean]) => c[0]);
    expect(calls.indexOf(true)).toBeLessThan(calls.indexOf(false));
  });

  // ─── Error handling ───────────────────────────────────────────

  it('handles errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (GeminiService.streamChat as jest.Mock).mockImplementation(() => {
      throw new Error('API Error');
    });

    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    expect(result.current.error).toBe('API Error');
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockUpdateLastMessage).toHaveBeenCalledWith('Error: API Error');
    consoleSpy.mockRestore();
  });

  it('handles non-Error throws', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (GeminiService.streamChat as jest.Mock).mockImplementation(() => {
      throw 'string error';
    });

    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    expect(result.current.error).toBe('An unexpected error occurred');
    consoleSpy.mockRestore();
  });

  // ─── Guard clauses ────────────────────────────────────────────

  it('does nothing for empty messages', async () => {
    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('');
    });

    expect(mockAddMessage).not.toHaveBeenCalled();
    expect(mockSetLoading).not.toHaveBeenCalled();
  });

  it('does nothing for whitespace-only messages', async () => {
    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('   ');
    });

    expect(mockAddMessage).not.toHaveBeenCalled();
  });

  it('does nothing when already loading', async () => {
    setupMockStore({ isLoading: true });

    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    expect(mockAddMessage).not.toHaveBeenCalled();
  });

  // ─── Error state reset ────────────────────────────────────────

  it('clears error on new message', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // First: trigger an error
    (GeminiService.streamChat as jest.Mock).mockImplementation(() => {
      throw new Error('First error');
    });

    const { result } = renderHook(() => useGeminiChat());

    await act(async () => {
      await result.current.sendMessage('First');
    });
    expect(result.current.error).toBe('First error');

    // Second: send a successful message — error should be cleared
    const mockStream = (async function* () {
      yield 'ok';
    })();
    (GeminiService.streamChat as jest.Mock).mockReturnValue(mockStream);

    await act(async () => {
      await result.current.sendMessage('Second');
    });

    expect(result.current.error).toBeNull();
    consoleSpy.mockRestore();
  });
});
