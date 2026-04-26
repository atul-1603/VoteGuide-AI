import { NextRequest, NextResponse } from "next/server";
import { GeminiServerService } from "@/services/gemini-server";
import {
  chatRequestSchema,
  createErrorResponse,
  API_ERROR_CODES,
} from "@/types/api";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        createErrorResponse(
          parsed.error.issues[0]?.message ?? "Invalid request format",
          API_ERROR_CODES.VALIDATION_ERROR
        ),
        { status: 400 }
      );
    }

    const { messages } = parsed.data;
    const responseBody = await GeminiServerService.streamGenerateContent(messages);

    if (!responseBody) {
      return NextResponse.json(
        createErrorResponse(
          "Failed to initialize stream",
          API_ERROR_CODES.STREAM_INIT_FAILED
        ),
        { status: 500 }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = responseBody.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const text = GeminiServerService.parseSSEChunk(chunk);
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (e) {
          console.error("[Chat API] Streaming error:", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("[Chat API] Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      createErrorResponse(message, API_ERROR_CODES.INTERNAL_ERROR),
      { status: 500 }
    );
  }
}
