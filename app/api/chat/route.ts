import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

function detectAgent(message: string): "flashcard" | "quiz" | "generalist" {
  const lower = message.toLowerCase();
  if (lower.includes("flashcard") || lower.includes("flash card")) {
    return "flashcard";
  }
  if (
    lower.includes("quiz") ||
    lower.includes("test me") ||
    lower.includes("practice question")
  ) {
    return "quiz";
  }
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const message = (formData.get("message") as string) || "";
    const pdfFile = formData.get("pdf") as File | null;

    const agentType = detectAgent(message);

    // Build contents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [];

    if (pdfFile) {
      const base64 = await fileToBase64(pdfFile);
      parts.push({
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      });
    }

    if (message) {
      parts.push({ text: message });
    }

    if (parts.length === 0) {
      return NextResponse.json(
        { error: "No message or PDF provided" },
        { status: 400 }
      );
    }

    if (agentType === "generalist") {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts,
          },
        ],
        config: {
          systemInstruction:
            "You are a helpful study assistant. Answer questions based strictly on the provided course material. If no PDF is provided, answer based on general knowledge but note that uploading course material will give more accurate answers.",
        },
      });

      const text = response.text ?? "";
      return NextResponse.json({ type: "text", content: text });
    }

    if (agentType === "flashcard") {
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

      const prompt = parts.length > 0 ? parts : [{ text: message }];

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              ...prompt,
              {
                text: "Generate comprehensive flashcards from the provided course material. Create at least 8-12 flashcards covering key concepts, definitions, and important facts.",
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: flashcardSchema,
          systemInstruction:
            "You are a study assistant that generates flashcards from course material. Each flashcard should have a clear question on the front and a concise, accurate answer on the back.",
        },
      });

      const jsonText = response.text ?? "{}";
      const parsed = JSON.parse(jsonText);
      return NextResponse.json({ type: "flashcards", content: parsed });
    }

    if (agentType === "quiz") {
      const quizSchema = {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                options: {
                  type: "array",
                  items: { type: "string" },
                },
                correctIndex: { type: "number" },
                explanation: { type: "string" },
              },
              required: ["question", "options", "correctIndex", "explanation"],
            },
          },
        },
        required: ["questions"],
      };

      const prompt = parts.length > 0 ? parts : [{ text: message }];

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              ...prompt,
              {
                text: "Generate 5 multiple-choice quiz questions from the provided course material. Each question should have exactly 4 options, a correct answer index (0-3), and a brief explanation.",
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: quizSchema,
          systemInstruction:
            "You are a study assistant that creates multiple-choice quiz questions based on course material. Questions should test understanding of key concepts.",
        },
      });

      const jsonText = response.text ?? "{}";
      const parsed = JSON.parse(jsonText);
      return NextResponse.json({ type: "quiz", content: parsed });
    }

    return NextResponse.json({ error: "Unknown agent type" }, { status: 400 });
  } catch (err) {
    console.error("Chat API error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
