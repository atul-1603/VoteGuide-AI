/**
 * @jest-environment node
 */
import { POST } from './route';
import { GeminiServerService } from '@/lib/gemini-server';
import { NextRequest } from 'next/server';

// Mock GeminiServerService
jest.mock('@/lib/gemini-server');

describe('Chat API Route', () => {
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

    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
    });

    const response = await POST(req);
    
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/plain');
  });

  it('returns 400 for invalid body', async () => {
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({}), // Missing messages
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });
});
