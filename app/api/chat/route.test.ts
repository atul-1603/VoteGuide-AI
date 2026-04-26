/**
 * @jest-environment node
 */
import { POST } from './route';
import { GeminiServerService } from '@/services/gemini-server';
import { NextRequest } from 'next/server';

// Mock GeminiServerService
jest.mock('@/services/gemini-server');

describe('Chat API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Helper to create a NextRequest ─────────────────────────────

  function createRequest(body: unknown): NextRequest {
    return new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ─── Validation Tests ──────────────────────────────────────────

  describe('request validation', () => {
    it('returns 400 for empty body', async () => {
      const req = createRequest({});
      const response = await POST(req);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 for messages as non-array', async () => {
      const req = createRequest({ messages: 'not-an-array' });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it('returns 400 for empty messages array', async () => {
      const req = createRequest({ messages: [] });
      const response = await POST(req);

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toContain('At least one message');
    });

    it('returns 400 for messages missing required fields', async () => {
      const req = createRequest({
        messages: [{ role: 'user' }], // missing id, content, createdAt
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  // ─── Streaming Success Tests ────────────────────────────────────

  describe('successful streaming', () => {
    it('returns a streaming response for valid requests', async () => {
      const encoder = new TextEncoder();
      const mockStream = {
        getReader: jest.fn(() => ({
          read: jest.fn()
            .mockResolvedValueOnce({ done: false, value: encoder.encode('chunk 1') })
            .mockResolvedValueOnce({ done: true }),
        })),
      };

      (GeminiServerService.streamGenerateContent as jest.Mock).mockResolvedValue(mockStream);
      (GeminiServerService.parseSSEChunk as jest.Mock).mockReturnValue('parsed text');

      const req = createRequest({
        messages: [{
          id: '1',
          role: 'user',
          content: 'Hello',
          createdAt: new Date().toISOString(),
        }],
      });

      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toContain('text/plain');
      expect(response.headers.get('Cache-Control')).toBe('no-cache');
    });

    it('returns 500 when stream body is null', async () => {
      (GeminiServerService.streamGenerateContent as jest.Mock).mockResolvedValue(null);

      const req = createRequest({
        messages: [{
          id: '1',
          role: 'user',
          content: 'Hello',
          createdAt: new Date().toISOString(),
        }],
      });

      const response = await POST(req);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.code).toBe('STREAM_INIT_FAILED');
    });
  });

  // ─── Error Handling Tests ───────────────────────────────────────

  describe('error handling', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('returns 500 with message when Gemini throws', async () => {
      (GeminiServerService.streamGenerateContent as jest.Mock).mockRejectedValue(
        new Error('API key invalid')
      );

      const req = createRequest({
        messages: [{
          id: '1',
          role: 'user',
          content: 'Hello',
          createdAt: new Date().toISOString(),
        }],
      });

      const response = await POST(req);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.message).toBe('API key invalid');
      expect(body.code).toBe('INTERNAL_ERROR');
    });

    it('returns generic message for non-Error throws', async () => {
      (GeminiServerService.streamGenerateContent as jest.Mock).mockRejectedValue(
        'string error'
      );

      const req = createRequest({
        messages: [{
          id: '1',
          role: 'user',
          content: 'Hello',
          createdAt: new Date().toISOString(),
        }],
      });

      const response = await POST(req);

      expect(response.status).toBe(500);
      const body = await response.json();
      expect(body.message).toBe('Internal Server Error');
    });
  });
});
