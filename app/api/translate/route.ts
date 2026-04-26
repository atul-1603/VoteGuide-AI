import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  translateRequestSchema,
  createSuccessResponse,
  createErrorResponse,
  API_ERROR_CODES,
  type TranslateResponseData,
} from "@/types/api";

/** Shape of a successful Google Translate API v2 response */
interface GoogleTranslateResponse {
  data?: {
    translations?: Array<{ translatedText?: string }>;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = translateRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        createErrorResponse(
          parsed.error.issues[0]?.message ?? "Missing required fields",
          API_ERROR_CODES.VALIDATION_ERROR
        ),
        { status: 400 }
      );
    }

    const { text, targetLang } = parsed.data;

    const apiKeyResult = z.string().min(1).safeParse(process.env.GOOGLE_TRANSLATE_API_KEY);
    
    if (!apiKeyResult.success) {
      // Fallback: return original text if no API key configured
      return NextResponse.json(
        createSuccessResponse<TranslateResponseData>({ translatedText: text })
      );
    }

    const apiKey = apiKeyResult.data;
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, target: targetLang }),
    });

    if (!response.ok) {
      console.error("[Translate API] Google Translate error:", response.status);
      return NextResponse.json(
        createErrorResponse("Translation failed", API_ERROR_CODES.EXTERNAL_API_ERROR),
        { status: 502 }
      );
    }

    const data: GoogleTranslateResponse = await response.json();
    const translatedText = data?.data?.translations?.[0]?.translatedText;

    if (!translatedText) {
      return NextResponse.json(
        createErrorResponse(
          "Unexpected response from translation service",
          API_ERROR_CODES.EXTERNAL_API_ERROR
        ),
        { status: 502 }
      );
    }

    return NextResponse.json(
      createSuccessResponse<TranslateResponseData>({ translatedText })
    );
  } catch (error: unknown) {
    console.error("[Translate API] Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      createErrorResponse(message, API_ERROR_CODES.INTERNAL_ERROR),
      { status: 500 }
    );
  }
}
