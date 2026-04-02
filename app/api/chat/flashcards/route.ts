import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { pushMessage } from "@/app/api/chat/route";
import { StoredMessage } from "@/lib/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const flashcardSchema = {
  type: "object",
  properties: {
    flashcards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          front: { type: "string" },
          back: { type: "string" },
        },
        required: ["front", "back"],
      },
    },
  },
  required: ["flashcards"],
};

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { chatId, message } = await req.json();

    if (!chatId || !ObjectId.isValid(chatId))
      return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });

    const db = await getDb();
    const chat = await db.collection("chats").findOne({ _id: new ObjectId(chatId), userId });
    if (!chat)
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [];
    if (chat.activePdfBase64)
      parts.push({ inlineData: { mimeType: "application/pdf", data: chat.activePdfBase64 } });
    if (message) parts.push({ text: message });
    parts.push({ text: "Generate 8–12 comprehensive flashcards covering the key concepts, definitions, and important facts from the material above." });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: flashcardSchema,
        systemInstruction:
          "You are a study assistant that generates flashcards. Each card must have a clear, specific question on the front and a concise, accurate answer on the back.",
      },
    });

    const parsed = JSON.parse(response.text ?? "{}");

    const msg: StoredMessage = {
      id: new ObjectId().toString(),
      role: "assistant",
      content: parsed,
      type: "flashcards",
      createdAt: new Date().toISOString(),
    };
    await pushMessage(chatId, msg, {}, db);

    return NextResponse.json({ type: "flashcards", content: parsed, messageId: msg.id });
  } catch (err) {
    console.error("Flashcards error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}
