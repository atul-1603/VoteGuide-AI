import {
  createSuccessResponse,
  createErrorResponse,
  chatRequestSchema,
  calendarRequestSchema,
  translateRequestSchema,
  API_ERROR_CODES,
} from './api';

describe('API Types & Helpers', () => {
  // ─── Response Helpers ──────────────────────────────────────────

  describe('createSuccessResponse', () => {
    it('wraps data in a success envelope', () => {
      const result = createSuccessResponse({ id: 1 });
      expect(result).toEqual({ success: true, data: { id: 1 } });
    });

    it('works with primitive data', () => {
      const result = createSuccessResponse('hello');
      expect(result).toEqual({ success: true, data: 'hello' });
    });

    it('works with null data', () => {
      const result = createSuccessResponse(null);
      expect(result).toEqual({ success: true, data: null });
    });
  });

  describe('createErrorResponse', () => {
    it('creates a structured error response', () => {
      const result = createErrorResponse('Something failed', 'INTERNAL_ERROR');
      expect(result).toEqual({
        success: false,
        message: 'Something failed',
        code: 'INTERNAL_ERROR',
      });
    });
  });

  // ─── Chat Request Schema ───────────────────────────────────────

  describe('chatRequestSchema', () => {
    it('accepts valid chat request', () => {
      const result = chatRequestSchema.safeParse({
        messages: [{
          id: '1',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01T00:00:00Z',
        }],
      });
      expect(result.success).toBe(true);
    });

    it('coerces string dates to Date objects', () => {
      const result = chatRequestSchema.safeParse({
        messages: [{
          id: '1',
          role: 'user',
          content: 'Hello',
          createdAt: '2026-01-01T00:00:00Z',
        }],
      });
      if (result.success) {
        expect(result.data.messages[0].createdAt).toBeInstanceOf(Date);
      }
    });

    it('rejects empty messages array', () => {
      const result = chatRequestSchema.safeParse({ messages: [] });
      expect(result.success).toBe(false);
    });

    it('rejects invalid role', () => {
      const result = chatRequestSchema.safeParse({
        messages: [{
          id: '1',
          role: 'admin',
          content: 'Hello',
          createdAt: new Date().toISOString(),
        }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing fields', () => {
      const result = chatRequestSchema.safeParse({
        messages: [{ role: 'user' }],
      });
      expect(result.success).toBe(false);
    });
  });

  // ─── Calendar Request Schema ───────────────────────────────────

  describe('calendarRequestSchema', () => {
    it('accepts valid calendar request', () => {
      const result = calendarRequestSchema.safeParse({
        eventTitle: 'Polling Day',
        date: '2026-05-01',
        description: 'Vote!',
        accessToken: 'token123',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty eventTitle', () => {
      const result = calendarRequestSchema.safeParse({
        eventTitle: '',
        date: '2026-05-01',
        description: 'Vote!',
        accessToken: 'token123',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid date string', () => {
      const result = calendarRequestSchema.safeParse({
        eventTitle: 'Test',
        date: 'not-a-date',
        description: 'Test',
        accessToken: 'token',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty accessToken', () => {
      const result = calendarRequestSchema.safeParse({
        eventTitle: 'Test',
        date: '2026-05-01',
        description: 'Test',
        accessToken: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing fields', () => {
      const result = calendarRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  // ─── Translate Request Schema ──────────────────────────────────

  describe('translateRequestSchema', () => {
    it('accepts valid translate request', () => {
      const result = translateRequestSchema.safeParse({
        text: 'Hello',
        targetLang: 'hi',
      });
      expect(result.success).toBe(true);
    });

    it('rejects empty text', () => {
      const result = translateRequestSchema.safeParse({
        text: '',
        targetLang: 'hi',
      });
      expect(result.success).toBe(false);
    });

    it('rejects empty targetLang', () => {
      const result = translateRequestSchema.safeParse({
        text: 'Hello',
        targetLang: '',
      });
      expect(result.success).toBe(false);
    });
  });

  // ─── API Error Codes ───────────────────────────────────────────

  describe('API_ERROR_CODES', () => {
    it('contains all expected error codes', () => {
      expect(API_ERROR_CODES.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(API_ERROR_CODES.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(API_ERROR_CODES.STREAM_INIT_FAILED).toBe('STREAM_INIT_FAILED');
      expect(API_ERROR_CODES.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
      expect(API_ERROR_CODES.EXTERNAL_API_ERROR).toBe('EXTERNAL_API_ERROR');
      expect(API_ERROR_CODES.MISSING_CONFIG).toBe('MISSING_CONFIG');
    });
  });
});
