import { apiClient, ApiError } from './api-client';

describe('api-client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully fetches and parses JSON data', async () => {
    const mockData = { success: true };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await apiClient('/test');
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('/test', expect.any(Object));
  });

  it('throws ApiError when response is not ok', async () => {
    const errorData = { error: 'Not Found' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: jest.fn().mockResolvedValue(errorData),
    });

    await expect(apiClient('/test')).rejects.toThrow(ApiError);
  });

  it('handles network failure gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network failure'));

    await expect(apiClient('/test')).rejects.toThrow('Network failure');
  });
});
