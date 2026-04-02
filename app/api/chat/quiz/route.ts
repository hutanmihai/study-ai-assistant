import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { pushMessage } from "@/app/api/chat/route";
import { StoredMessage } from "@/lib/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const quizSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          correctIndex: { type: "number" },
          explanation: { type: "string" },
        },
        required: ["question", "options", "correctIndex", "explanation"],
      },
    },
  },
  required: ["questions"],
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
    parts.push({ text: "Generate 5–8 multiple-choice quiz questions from the material above. Each question must have exactly 4 options, a correctIndex (0–3), and a brief explanation of the correct answer." });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        systemInstruction:
          "You are a study assistant that creates multiple-choice quiz questions. Questions should test genuine understanding of key concepts, not just surface-level recall.",
      },
    });

    const parsed = JSON.parse(response.text ?? "{}");

    const msg: StoredMessage = {
      id: new ObjectId().toString(),
      role: "assistant",
      content: parsed,
      type: "quiz",
      createdAt: new Date().toISOString(),
    };
    await pushMessage(chatId, msg, {}, db);

    return NextResponse.json({ type: "quiz", content: parsed, messageId: msg.id });
  } catch (err) {
    console.error("Quiz error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}
