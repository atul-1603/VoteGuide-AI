import { Message } from "@/types/election";

const SYSTEM_INSTRUCTION = `You are VoteGuide, a highly knowledgeable, helpful, and neutral AI election assistant. 
Your goal is to guide citizens through the election process, explain voter registration, ID requirements, and their rights.
Always maintain a neutral, informative, and encouraging tone. Cite ECI (Election Commission of India) as the official source.
Do not hallucinate dates; if you do not know a specific date, advise the user to check the official ECI website (eci.gov.in).
Format your responses using clear markdown (bolding, bullet points) to make them readable.`;

export class GeminiServerService {
  static async streamGenerateContent(messages: Message[]) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const contents = messages
      .filter((msg) => msg.content && msg.content.trim() !== "")
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    if (contents.length > 0 && contents[0].role === "user") {
      contents[0].parts[0].text = `${SYSTEM_INSTRUCTION}\n\nUser Question: ${contents[0].parts[0].text}`;
    }

    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    return response.body;
  }

  static parseSSEChunk(chunk: string): string {
    const lines = chunk.split("\n");
    let result = "";
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            result += text;
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
    return result;
  }
}
