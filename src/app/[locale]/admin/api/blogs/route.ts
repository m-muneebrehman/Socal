import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "blogs";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const blogs = await db.collection(COLLECTION).find({}).sort({ date: -1 }).toArray();
  return NextResponse.json(blogs);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.slug || !data.title || !data.category || !data.author || !data.date || !data.status || !data.content || !data.content.lead) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  // Ensure unique slug
  const existing = await db.collection(COLLECTION).findOne({ slug: data.slug });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }
  const now = new Date();
  const result = await db.collection(COLLECTION).insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return NextResponse.json({ _id: result.insertedId, ...data });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (!data._id) return NextResponse.json({ error: "Blog ID required" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  const { _id, ...update } = data;
  update.updatedAt = new Date();
  // Prevent slug collision
  if (update.slug) {
    const existing = await db.collection(COLLECTION).findOne({ slug: update.slug, _id: { $ne: new ObjectId(_id) } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }
  await db.collection(COLLECTION).updateOne({ _id: new ObjectId(_id) }, { $set: update });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { _id } = await req.json();
  if (!_id) return NextResponse.json({ error: "Blog ID required" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(_id) });
  return NextResponse.json({ success: true });
}