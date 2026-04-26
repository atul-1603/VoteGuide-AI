import { GeminiServerService } from './gemini-server';

// We need to mock fetch at the module level for the server service
const mockFetch = global.fetch as jest.Mock;

describe('GeminiServerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── streamGenerateContent ─────────────────────────────────────────

  describe('streamGenerateContent', () => {
    const validMessages = [
      { id: '1', role: 'user' as const, content: 'Hello', createdAt: new Date() },
    ];

    it('throws if GEMINI_API_KEY is not set', async () => {
      const original = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      await expect(
        GeminiServerService.streamGenerateContent(validMessages)
      ).rejects.toThrow('GEMINI_API_KEY is not configured');

      process.env.GEMINI_API_KEY = original;
    });

    it('calls the Gemini API with correct URL and body', async () => {
      process.env.GEMINI_API_KEY = 'test-key-123';

      const mockBody = { getReader: jest.fn() };
      mockFetch.mockResolvedValue({
        ok: true,
        body: mockBody,
      });

      const result = await GeminiServerService.streamGenerateContent(validMessages);

      expect(result).toBe(mockBody);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toContain('gemini-2.5-flash');
      expect(url).toContain('key=test-key-123');
      expect(options.method).toBe('POST');

      const body = JSON.parse(options.body);
      expect(body.contents).toHaveLength(1);
      expect(body.contents[0].parts[0].text).toContain('User Question: Hello');
      expect(body.generationConfig.temperature).toBe(0.7);

      delete process.env.GEMINI_API_KEY;
    });

    it('prepends system instruction to the first user message', async () => {
      process.env.GEMINI_API_KEY = 'test-key';
      mockFetch.mockResolvedValue({ ok: true, body: {} });

      await GeminiServerService.streamGenerateContent(validMessages);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.contents[0].parts[0].text).toContain('VoteGuide');
      expect(body.contents[0].parts[0].text).toContain('User Question: Hello');

      delete process.env.GEMINI_API_KEY;
    });

    it('does not prepend system instruction when first message is model', async () => {
      process.env.GEMINI_API_KEY = 'test-key';
      mockFetch.mockResolvedValue({ ok: true, body: {} });

      const modelFirst = [
        { id: '1', role: 'model' as const, content: 'Hi', createdAt: new Date() },
        { id: '2', role: 'user' as const, content: 'Hello', createdAt: new Date() },
      ];

      await GeminiServerService.streamGenerateContent(modelFirst);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.contents[0].parts[0].text).toBe('Hi');
      expect(body.contents[0].parts[0].text).not.toContain('VoteGuide');

      delete process.env.GEMINI_API_KEY;
    });

    it('filters out empty messages', async () => {
      process.env.GEMINI_API_KEY = 'test-key';
      mockFetch.mockResolvedValue({ ok: true, body: {} });

      const messagesWithEmpty = [
        { id: '1', role: 'user' as const, content: '', createdAt: new Date() },
        { id: '2', role: 'user' as const, content: '   ', createdAt: new Date() },
        { id: '3', role: 'user' as const, content: 'Valid message', createdAt: new Date() },
      ];

      await GeminiServerService.streamGenerateContent(messagesWithEmpty);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.contents).toHaveLength(1);
      expect(body.contents[0].parts[0].text).toContain('Valid message');

      delete process.env.GEMINI_API_KEY;
    });

    it('throws on non-ok response with error text', async () => {
      process.env.GEMINI_API_KEY = 'test-key';
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        text: jest.fn().mockResolvedValue('Rate limit exceeded'),
      });

      await expect(
        GeminiServerService.streamGenerateContent(validMessages)
      ).rejects.toThrow('Gemini API error (429): Rate limit exceeded');

      delete process.env.GEMINI_API_KEY;
    });
  });

  // ─── parseSSEChunk ─────────────────────────────────────────────────

  describe('parseSSEChunk', () => {
    it('parses valid SSE data lines', () => {
      const chunk = 'data: {"candidates":[{"content":{"parts":[{"text":"Hello"}]}}]}';
      expect(GeminiServerService.parseSSEChunk(chunk)).toBe('Hello');
    });

    it('concatenates text from multiple data lines', () => {
      const chunk = [
        'data: {"candidates":[{"content":{"parts":[{"text":"Hello "}]}}]}',
        'data: {"candidates":[{"content":{"parts":[{"text":"world"}]}}]}',
      ].join('\n');
      expect(GeminiServerService.parseSSEChunk(chunk)).toBe('Hello world');
    });

    it('ignores non-data lines', () => {
      const chunk = [
        ': comment line',
        'event: message',
        'data: {"candidates":[{"content":{"parts":[{"text":"Only this"}]}}]}',
        '',
      ].join('\n');
      expect(GeminiServerService.parseSSEChunk(chunk)).toBe('Only this');
    });

    it('returns empty string for chunks with no text', () => {
      const chunk = 'data: {"candidates":[{"content":{"parts":[]}}]}';
      expect(GeminiServerService.parseSSEChunk(chunk)).toBe('');
    });

    it('returns empty string for empty candidates array', () => {
      const chunk = 'data: {"candidates":[]}';
      expect(GeminiServerService.parseSSEChunk(chunk)).toBe('');
    });

    it('handles invalid JSON gracefully', () => {
      const chunk = 'data: {invalid json here}';
      expect(GeminiServerService.parseSSEChunk(chunk)).toBe('');
    });

    it('returns empty string for empty input', () => {
      expect(GeminiServerService.parseSSEChunk('')).toBe('');
    });

    it('skips lines with missing nested properties', () => {
      const chunk = 'data: {"candidates":[{"content":{}}]}';
      expect(GeminiServerService.parseSSEChunk(chunk)).toBe('');
    });

    it('logs warning in development mode for unparseable chunks', () => {
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true });
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      GeminiServerService.parseSSEChunk('data: not-json');

      expect(warnSpy).toHaveBeenCalledWith(
        '[Gemini SSE] Skipped unparseable chunk:',
        expect.any(String)
      );

      warnSpy.mockRestore();
      Object.defineProperty(process.env, 'NODE_ENV', { value: originalEnv, writable: true });
    });
  });
});
