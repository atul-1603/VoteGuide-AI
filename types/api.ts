import { z } from "zod";

// ─── Standard API Response Envelope ─────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Response Helpers ───────────────────────────────────────────────

export function createSuccessResponse<T>(data: T): ApiSuccessResponse<T> {
  return { success: true, data };
}

export function createErrorResponse(
  message: string,
  code: string
): ApiErrorResponse {
  return { success: false, message, code };
}

// ─── API Request Schemas ────────────────────────────────────────────

/** POST /api/chat */
export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(["user", "model"]),
        content: z.string(),
        createdAt: z.coerce.date(),
      })
    )
    .min(1, "At least one message is required"),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

/** POST /api/calendar */
export const calendarRequestSchema = z.object({
  eventTitle: z.string().min(1, "Event title is required"),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date string" }
  ),
  description: z.string(),
  accessToken: z.string().min(1, "Access token is required"),
});

export type CalendarRequest = z.infer<typeof calendarRequestSchema>;

/** POST /api/translate */
export const translateRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
  targetLang: z.string().min(1, "Target language is required"),
});

export type TranslateRequest = z.infer<typeof translateRequestSchema>;

// ─── API Response Data Types ────────────────────────────────────────

export interface CalendarResponseData {
  eventLink: string;
}

export interface TranslateResponseData {
  translatedText: string;
}

// ─── Gemini SSE Parsed Chunk ────────────────────────────────────────

export interface GeminiSSECandidate {
  content?: {
    parts?: Array<{ text?: string }>;
  };
}

export interface GeminiSSEData {
  candidates?: GeminiSSECandidate[];
}

// ─── Standard Error Codes ───────────────────────────────────────────

export const API_ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  STREAM_INIT_FAILED: "STREAM_INIT_FAILED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
  MISSING_CONFIG: "MISSING_CONFIG",
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
