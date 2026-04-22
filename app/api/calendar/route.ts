import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { eventTitle: string; date: string; description: string; accessToken: string };
    const { eventTitle, date, description, accessToken } = body;

    if (!accessToken) {
      return NextResponse.json({ error: "No access token provided" }, { status: 401 });
    }

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
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
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
      const errorData = await response.json();
      console.error("Calendar API Error:", errorData);
      return NextResponse.json({ error: "Failed to create calendar event" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ eventLink: data.htmlLink });
  } catch (error) {
    console.error("❌ Calendar route error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
