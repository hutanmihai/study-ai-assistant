import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { StoredMessage } from "@/lib/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

function detectAgent(message: string): "flashcard" | "quiz" | "generalist" {
  const lower = message.toLowerCase();
  if (lower.includes("flashcard") || lower.includes("flash card"))
    return "flashcard";
  if (
    lower.includes("quiz") ||
    lower.includes("test me") ||
    lower.includes("practice question")
  )
    return "quiz";
  return "generalist";
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function generateChatName(
  userMsg: string,
  assistantMsg: string
): Promise<string> {
  try {
    const resp = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Given this study chat exchange, write a short title (4-6 words max, no quotes, no trailing punctuation):\nUser: ${userMsg.slice(0, 200)}\nAssistant: ${assistantMsg.slice(0, 200)}\n\nTitle:`,
            },
          ],
        },
      ],
    });
    return (resp.text ?? "Study Session").trim().slice(0, 60);
  } catch {
    return userMsg.slice(0, 40) || "Study Session";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function pushMessage(chatId: string, msg: StoredMessage, extraSet: Record<string, unknown> = {}, db: any) {
  await db.collection("chats").updateOne(
    { _id: new ObjectId(chatId) },
    {
      $push: { messages: msg },
      $inc: { messageCount: 1 },
      $set: { updatedAt: new Date().toISOString(), ...extraSet },
    }
  );
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const message = (formData.get("message") as string) || "";
    const chatId = formData.get("chatId") as string;
    const pdfFile = formData.get("pdf") as File | null;

    if (!chatId || !ObjectId.isValid(chatId))
      return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });

    const db = await getDb();
    const chat = await db
      .collection("chats")
      .findOne({ _id: new ObjectId(chatId), userId });

    if (!chat)
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    // Resolve PDF: new upload takes priority, else use stored one
    let pdfBase64: string | null = null;
    let pdfName: string | null = null;

    if (pdfFile && pdfFile.size > 0) {
      pdfBase64 = await fileToBase64(pdfFile);
      pdfName = pdfFile.name;
      await db.collection("chats").updateOne(
        { _id: new ObjectId(chatId) },
        {
          $set: {
            activePdfBase64: pdfBase64,
            activePdfName: pdfName,
            updatedAt: new Date().toISOString(),
          },
        }
      );
    } else if (chat.activePdfBase64) {
      pdfBase64 = chat.activePdfBase64;
      pdfName = chat.activePdfName ?? null;
    }

    // Build Gemini parts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [];
    if (pdfBase64) {
      parts.push({
        inlineData: { mimeType: "application/pdf", data: pdfBase64 },
      });
    }
    if (message) parts.push({ text: message });

    if (parts.length === 0)
      return NextResponse.json(
        { error: "No message or PDF provided" },
        { status: 400 }
      );

    const isFirstMessage = (chat.messageCount ?? 0) === 0;
    const agentType = detectAgent(message);

    // Save user message
    const userMsg: StoredMessage = {
      id: new ObjectId().toString(),
      role: "user",
      content: message,
      type: "text",
      pdfName: pdfName ?? undefined,
      createdAt: new Date().toISOString(),
    };
    await pushMessage(chatId, userMsg, {}, db);

    // ── GENERALIST: streaming ───────────────────────────────────────────────
    if (agentType === "generalist") {
      const encoder = new TextEncoder();
      let fullText = "";

      const readable = new ReadableStream({
        async start(controller) {
          try {
            const streamResult = await ai.models.generateContentStream({
              model: "gemini-2.0-flash",
              contents: [{ role: "user", parts }],
              config: {
                systemInstruction:
                  "You are a helpful study assistant. Answer questions based on the provided course material. If no PDF is provided, answer from general knowledge but suggest uploading course material for more accurate answers. Use markdown for structure where helpful.",
              },
            });

            for await (const chunk of streamResult) {
              const text = chunk.text ?? "";
              if (text) {
                fullText += text;
                controller.enqueue(encoder.encode(text));
              }
            }

            // Persist assistant message (stream still open — safe in serverless)
            const assistantMsg: StoredMessage = {
              id: new ObjectId().toString(),
              role: "assistant",
              content: fullText,
              type: "text",
              createdAt: new Date().toISOString(),
            };
            const extraSet: Record<string, unknown> = {};
            if (isFirstMessage) {
              extraSet.name = await generateChatName(message, fullText);
            }
            await pushMessage(chatId, assistantMsg, extraSet, db);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Chat-Id": chatId,
          "Cache-Control": "no-cache",
        },
      });
    }

    // ── FLASHCARD / QUIZ: structured output ────────────────────────────────
    const isFlashcard = agentType === "flashcard";

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

    const extraInstruction = isFlashcard
      ? "Generate 8-12 comprehensive flashcards covering key concepts, definitions, and important facts."
      : "Generate 5 multiple-choice quiz questions. Each must have exactly 4 options, a correctIndex (0-3), and a brief explanation.";

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "user", parts: [...parts, { text: extraInstruction }] },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: isFlashcard ? flashcardSchema : quizSchema,
        systemInstruction: isFlashcard
          ? "You are a study assistant generating flashcards. Each card: clear question on front, concise answer on back."
          : "You are a study assistant creating multiple-choice questions testing understanding of key concepts.",
      },
    });

    const jsonText = response.text ?? "{}";
    const parsed = JSON.parse(jsonText);
    const type = isFlashcard ? "flashcards" : "quiz";

    const assistantMsg: StoredMessage = {
      id: new ObjectId().toString(),
      role: "assistant",
      content: parsed,
      type,
      createdAt: new Date().toISOString(),
    };
    const extraSet: Record<string, unknown> = {};
    if (isFirstMessage) {
      extraSet.name = await generateChatName(
        message,
        isFlashcard ? "Flashcards generated" : "Quiz questions generated"
      );
    }
    await pushMessage(chatId, assistantMsg, extraSet, db);

    return NextResponse.json({ type, content: parsed });
  } catch (err) {
    console.error("Chat API error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
