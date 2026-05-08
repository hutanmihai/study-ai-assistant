import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const results = await db
    .collection("quizResults")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chatId, quizMessageId, pdfName, questions, score, totalQuestions } = await req.json();

  const db = await getDb();
  const result = await db.collection("quizResults").insertOne({
    userId,
    chatId,
    quizMessageId,
    pdfName,
    questions,
    score,
    totalQuestions,
    createdAt: new Date(),
  });

  return NextResponse.json({ id: result.insertedId.toString() });
}
