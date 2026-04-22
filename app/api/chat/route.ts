import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM_INSTRUCTION = `You are VoteGuide, a highly knowledgeable, helpful, and neutral AI election assistant. 
Your goal is to guide citizens through the election process, explain voter registration, ID requirements, and their rights.
Always maintain a neutral, informative, and encouraging tone. Cite ECI (Election Commission of India) as the official source.
Do not hallucinate dates; if you do not know a specific date, advise the user to check the official ECI website (eci.gov.in).
Format your responses using clear markdown (bolding, bullet points) to make them readable.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }

    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "dummy_value") {
      console.error("GEMINI_API_KEY is missing or invalid");
      return NextResponse.json(
        { error: "Gemini API key is not configured correctly. Please check your .env.local file and restart the server." },
        { status: 500 }
      );
    }

    // Format messages for Gemini API
    const contents = messages
      .filter((msg: { content: string; role: string }) => msg.content && msg.content.trim() !== "")
      .map((msg: { content: string; role: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // Add system instruction as a user message at the beginning if not present
    // or use it to prefix the first message
    if (contents.length > 0 && contents[0].role === "user") {
      contents[0].parts[0].text = `${SYSTEM_INSTRUCTION}\n\nUser Question: ${contents[0].parts[0].text}`;
    }

    const model = "gemini-2.5-flash"; // Using flash for better performance/availability
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

    console.log(`Calling Gemini API: ${model}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Gemini API responded with ${response.status}: ${errorText}` },
        { status: response.status }
      );
    }

    // Stream the response back to the client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Extract the text content from the SSE chunks
            // Gemini returns chunks like: data: {"candidates": [{"content": {"parts": [{"text": "..."}]}}]}
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (e) {
          console.error("Streaming error:", e);
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
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
