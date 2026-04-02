import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const db = await getDb();
  const chat = await db
    .collection("chats")
    .findOne(
      { _id: new ObjectId(id), userId },
      { projection: { activePdfBase64: 0 } }
    );

  if (!chat)
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });

  return NextResponse.json({ ...chat, _id: chat._id.toString() });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const { name } = await req.json();
  if (!name?.trim())
    return NextResponse.json({ error: "Name required" }, { status: 400 });

  const db = await getDb();
  await db.collection("chats").updateOne(
    { _id: new ObjectId(id), userId },
    { $set: { name: name.trim(), updatedAt: new Date().toISOString() } }
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!ObjectId.isValid(id))
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const db = await getDb();
  await db
    .collection("chats")
    .deleteOne({ _id: new ObjectId(id), userId });

  return NextResponse.json({ ok: true });
}
