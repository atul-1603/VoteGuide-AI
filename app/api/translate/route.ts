import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!env.GOOGLE_TRANSLATE_API_KEY) {
      return NextResponse.json({ translatedText: text }); // Mock/fallback if no key
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${env.GOOGLE_TRANSLATE_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = await response.json();
    return NextResponse.json({ translatedText: data.data.translations[0].translatedText });
  } catch (error) {
    console.error("Translate API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
