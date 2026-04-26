import { GeminiService } from './gemini.service';

const mockFetch = global.fetch as jest.Mock;

describe('GeminiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const messages = [
    { id: '1', role: 'user' as const, content: 'Hello', createdAt: new Date() },
  ];

  describe('streamChat', () => {
    it('yields chunks from a successful streaming response', async () => {
      const encoder = new TextEncoder();
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ done: false, value: encoder.encode('chunk1') })
          .mockResolvedValueOnce({ done: false, value: encoder.encode('chunk2') })
          .mockResolvedValueOnce({ done: true }),
        releaseLock: jest.fn(),
      };

      mockFetch.mockResolvedValue({
        ok: true,
        body: { getReader: () => mockReader },
      });

      const chunks: string[] = [];
      for await (const chunk of GeminiService.streamChat(messages)) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['chunk1', 'chunk2']);
      expect(mockReader.releaseLock).toHaveBeenCalled();
    });

    it('sends correct request to /api/chat', async () => {
      const mockReader = {
        read: jest.fn().mockResolvedValue({ done: true }),
        releaseLock: jest.fn(),
      };

      mockFetch.mockResolvedValue({
        ok: true,
        body: { getReader: () => mockReader },
      });

      // Consume the generator
      for await (const _ of GeminiService.streamChat(messages)) {
        // noop
      }

      expect(mockFetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
    });

    it('throws with API error message on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockResolvedValue({
          success: false,
          message: 'Server overloaded',
          code: 'INTERNAL_ERROR',
        }),
      });

      const gen = GeminiService.streamChat(messages);
      await expect(gen.next()).rejects.toThrow('Server overloaded');
    });

    it('falls back to statusText when error JSON parsing fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 502,
        statusText: 'Bad Gateway',
        json: jest.fn().mockRejectedValue(new Error('not JSON')),
      });

      const gen = GeminiService.streamChat(messages);
      await expect(gen.next()).rejects.toThrow('Bad Gateway');
    });

    it('throws when response body is null', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        body: null,
      });

      const gen = GeminiService.streamChat(messages);
      await expect(gen.next()).rejects.toThrow('No response stream available');
    });

    it('releases reader lock even when stream is abandoned early', async () => {
      const encoder = new TextEncoder();
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({ done: false, value: encoder.encode('chunk1') })
          .mockResolvedValueOnce({ done: false, value: encoder.encode('chunk2') })
          .mockResolvedValueOnce({ done: true }),
        releaseLock: jest.fn(),
      };

      mockFetch.mockResolvedValue({
        ok: true,
        body: { getReader: () => mockReader },
      });

      const gen = GeminiService.streamChat(messages);
      await gen.next(); // read first chunk
      await gen.return(undefined); // abandon early

      expect(mockReader.releaseLock).toHaveBeenCalled();
    });
  });
});
