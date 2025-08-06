import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const COLLECTION = "users";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection(COLLECTION).find({}, { projection: { password: 0 } }).toArray();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection(COLLECTION).findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
  const hash = await bcrypt.hash(password, 10);
  const result = await db.collection(COLLECTION).insertOne({ email, password: hash, createdAt: new Date() });
  return NextResponse.json({ _id: result.insertedId, email });
}

export async function PUT(req: NextRequest) {
  const { _id, email, password } = await req.json();
  if (!_id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  const update: any = { email };
  if (password) update.password = await bcrypt.hash(password, 10);
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(_id) }, { $set: update });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { _id } = await req.json();
  if (!_id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(_id) });
  return NextResponse.json({ success: true });
}