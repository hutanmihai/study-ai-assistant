import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { getDb } from "@/lib/mongodb";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const analysisSchema = {
  type: "object",
  properties: {
    weakTopics: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
    miniQuiz: {
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
  required: ["weakTopics", "summary", "miniQuiz"],
};

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await getDb();
    const results = await db
      .collection("quizResults")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    if (results.length === 0) {
      return NextResponse.json({ error: "not_enough_data" }, { status: 400 });
    }

    const quizSummary = results
      .map((r, i) => {
        const wrong = (r.questions as { question: string; options: string[]; correctIndex: number; explanation: string; isCorrect: boolean }[])
          .filter((q) => !q.isCorrect)
          .map((q) => `  - "${q.question}" (correct: ${q.options[q.correctIndex]})`)
          .join("\n");
        return `Quiz ${i + 1} (score: ${r.score}%, ${r.totalQuestions} questions):\nMissed:\n${wrong || "  All correct"}`;
      })
      .join("\n\n");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        role: "user",
        parts: [{
          text: `Here are a student's recent quiz results:\n\n${quizSummary}\n\nBased on the incorrect answers, identify weak topic areas and generate exactly 5 targeted multiple-choice questions to help the student improve on those topics. Each question must have exactly 4 options.`,
        }],
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction:
          "You are a study coach analyzing a student's quiz performance. Identify patterns in incorrect answers to pinpoint weak areas, then generate focused practice questions on exactly those topics.",
      },
    });

    const parsed = JSON.parse(response.text ?? "{}");
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Weak spot analysis error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
