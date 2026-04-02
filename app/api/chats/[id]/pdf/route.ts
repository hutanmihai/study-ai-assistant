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
    .findOne({ _id: new ObjectId(id), userId });

  if (!chat || !chat.activePdfBase64)
    return NextResponse.json({ error: "No PDF found" }, { status: 404 });

  const buffer = Buffer.from(chat.activePdfBase64, "base64");

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${chat.activePdfName ?? "document.pdf"}"`,
    },
  });
}
