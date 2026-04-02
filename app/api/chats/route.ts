import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const chats = await db
    .collection("chats")
    .find(
      { userId },
      { projection: { activePdfBase64: 0, messages: 0 } }
    )
    .sort({ updatedAt: -1 })
    .toArray();

  return NextResponse.json(
    chats.map((c) => ({
      _id: c._id.toString(),
      name: c.name,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      messageCount: c.messageCount ?? 0,
      activePdfName: c.activePdfName,
    }))
  );
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = body.name || "New Chat";

  const db = await getDb();
  const now = new Date().toISOString();
  const result = await db.collection("chats").insertOne({
    userId,
    name,
    createdAt: now,
    updatedAt: now,
    messages: [],
    messageCount: 0,
  });

  return NextResponse.json({
    _id: result.insertedId.toString(),
    name,
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
  });
}
