import { apiClient, ApiError } from './api-client';

const mockFetch = global.fetch as jest.Mock;

describe('api-client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Success Cases ──────────────────────────────────────────────

  it('successfully fetches and parses JSON data', async () => {
    const mockData = { success: true };
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await apiClient('/test');
    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith('/test', expect.any(Object));
  });

  it('merges custom headers with default Content-Type', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    await apiClient('/test', {
      headers: { 'Authorization': 'Bearer token123' },
    });

    const callHeaders = mockFetch.mock.calls[0][1].headers;
    expect(callHeaders['Content-Type']).toBe('application/json');
    expect(callHeaders['Authorization']).toBe('Bearer token123');
  });

  it('passes through request options like method and body', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    await apiClient('/test', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });

    const options = mockFetch.mock.calls[0][1];
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify({ data: 'test' }));
  });

  // ─── Error Cases ────────────────────────────────────────────────

  it('throws ApiError when response is not ok', async () => {
    const errorData = { error: 'Not Found' };
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: jest.fn().mockResolvedValue(errorData),
    });

    try {
      await apiClient('/test');
      fail('Should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      const apiErr = e as ApiError;
      expect(apiErr.status).toBe(404);
      expect(apiErr.message).toBe('Not Found');
      expect(apiErr.data).toEqual(errorData);
      expect(apiErr.name).toBe('ApiError');
    }
  });

  it('falls back to statusText when error JSON parsing fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      json: jest.fn().mockRejectedValue(new Error('not json')),
    });

    try {
      await apiClient('/test');
      fail('Should have thrown');
    } catch (e) {
      const apiErr = e as ApiError;
      expect(apiErr.status).toBe(502);
      expect(apiErr.data).toEqual({ error: 'Bad Gateway' });
    }
  });

  it('uses "Request failed" when error data has no error field', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: jest.fn().mockResolvedValue({ details: 'something broke' }),
    });

    try {
      await apiClient('/test');
      fail('Should have thrown');
    } catch (e) {
      const apiErr = e as ApiError;
      expect(apiErr.message).toBe('Request failed');
    }
  });

  it('handles network failure gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'));

    await expect(apiClient('/test')).rejects.toThrow('Network failure');
  });

  // ─── Type Safety ────────────────────────────────────────────────

  it('returns typed data', async () => {
    interface TestData { id: number; name: string }
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ id: 1, name: 'test' }),
    });

    const result = await apiClient<TestData>('/test');
    expect(result.id).toBe(1);
    expect(result.name).toBe('test');
  });
});
