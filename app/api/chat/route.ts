import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { StoredMessage } from "@/lib/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function generateChatName(
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
export async function pushMessage(chatId: string, msg: StoredMessage, extraSet: Record<string, unknown> = {}, db: any) {
  await db.collection("chats").updateOne(
    { _id: new ObjectId(chatId) },
    {
      $push: { messages: msg },
      $inc: { messageCount: 1 },
      $set: { updatedAt: new Date().toISOString(), ...extraSet },
    }
  );
}

async function routeRequest(message: string): Promise<{ generateFlashcards: boolean; generateQuiz: boolean }> {
  try {
    const schema = {
      type: "object",
      properties: {
        generateFlashcards: { type: "boolean" },
        generateQuiz: { type: "boolean" },
      },
      required: ["generateFlashcards", "generateQuiz"],
    };
    const resp = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: message }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction:
          "You are a routing agent for a study assistant. Analyse the user message and decide: should flashcards be generated (generateFlashcards: true) and/or should a quiz be generated (generateQuiz: true)? Set to true only when the user explicitly asks for it or it is strongly implied (e.g. 'make flashcards', 'quiz me', 'test me', 'create cards'). Default to false when the user is just asking a question or requesting an explanation.",
      },
    });
    return JSON.parse(resp.text ?? "{}");
  } catch {
    return { generateFlashcards: false, generateQuiz: false };
  }
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

    // Resolve PDF
    let pdfBase64: string | null = null;
    let pdfName: string | null = null;

    if (pdfFile && pdfFile.size > 0) {
      pdfBase64 = await fileToBase64(pdfFile);
      pdfName = pdfFile.name;
      await db.collection("chats").updateOne(
        { _id: new ObjectId(chatId) },
        { $set: { activePdfBase64: pdfBase64, activePdfName: pdfName, updatedAt: new Date().toISOString() } }
      );
    } else if (chat.activePdfBase64) {
      pdfBase64 = chat.activePdfBase64;
      pdfName = chat.activePdfName ?? null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [];
    if (pdfBase64) parts.push({ inlineData: { mimeType: "application/pdf", data: pdfBase64 } });
    if (message) parts.push({ text: message });

    if (parts.length === 0)
      return NextResponse.json({ error: "No message or PDF provided" }, { status: 400 });

    const isFirstMessage = (chat.messageCount ?? 0) === 0;

    // Run routing + save user message in parallel
    const [flags] = await Promise.all([
      routeRequest(message),
      pushMessage(
        chatId,
        {
          id: new ObjectId().toString(),
          role: "user",
          content: message,
          type: "text",
          pdfName: pdfName ?? undefined,
          createdAt: new Date().toISOString(),
        },
        {},
        db
      ),
    ]);

    // Always stream generalist
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
                "You are a helpful study assistant. Answer questions based on the provided course material. If no PDF is provided, answer from general knowledge but suggest uploading course material for more accurate answers. Use markdown for structure where helpful. CRITICAL RULE: When the user asks for flashcards or a quiz (or both), you MUST respond with only a short, friendly confirmation like 'I will create them for you right away!' or 'Sure, generating your quiz now!'. You MUST NOT generate any flashcard or quiz content yourself — that is handled by a separate system. Do not list questions, answers, cards, or any study content in your response.",
            },
          });

          for await (const chunk of streamResult) {
            const text = chunk.text ?? "";
            if (text) {
              fullText += text;
              controller.enqueue(encoder.encode(text));
            }
          }

          const extraSet: Record<string, unknown> = {};
          if (isFirstMessage) {
            extraSet.name = await generateChatName(message, fullText);
          }
          await pushMessage(
            chatId,
            { id: new ObjectId().toString(), role: "assistant", content: fullText, type: "text", createdAt: new Date().toISOString() },
            extraSet,
            db
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Generate-Flashcards": flags.generateFlashcards ? "true" : "false",
        "X-Generate-Quiz": flags.generateQuiz ? "true" : "false",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}
