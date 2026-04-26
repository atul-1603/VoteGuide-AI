import { NextRequest, NextResponse } from "next/server";
import {
  calendarRequestSchema,
  createSuccessResponse,
  createErrorResponse,
  API_ERROR_CODES,
  type CalendarResponseData,
} from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = calendarRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        createErrorResponse(
          parsed.error.issues[0]?.message ?? "Invalid request format",
          API_ERROR_CODES.VALIDATION_ERROR
        ),
        { status: 400 }
      );
    }

    const { eventTitle, date, description, accessToken } = parsed.data;

    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1); // 1 hour event

    const event = {
      summary: eventTitle,
      description: description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email" as const, minutes: 24 * 60 },
          { method: "popup" as const, minutes: 60 },
        ],
      },
    };

    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      let errorDetail = "Failed to create calendar event";
      try {
        const errorData = await response.json();
        errorDetail = errorData?.error?.message ?? errorDetail;
      } catch {
        // Response body was not valid JSON — use default message
      }
      console.error("[Calendar API] Google Calendar error:", errorDetail);
      return NextResponse.json(
        createErrorResponse(errorDetail, API_ERROR_CODES.EXTERNAL_API_ERROR),
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(
      createSuccessResponse<CalendarResponseData>({ eventLink: data.htmlLink })
    );
  } catch (error: unknown) {
    console.error("[Calendar API] Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      createErrorResponse(message, API_ERROR_CODES.INTERNAL_ERROR),
      { status: 500 }
    );
  }
}
