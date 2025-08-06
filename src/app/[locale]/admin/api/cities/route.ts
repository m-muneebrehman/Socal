import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "cities";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const cities = await db.collection(COLLECTION).find({}).sort({ name: 1 }).toArray();
  return NextResponse.json(cities);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  
  // Validate required fields
  const requiredFields = [
    "slug", "name", "state", "shortDescription", "heroImage", 
    "population", "avgHomePrice", "tags", "neighborhoods", 
    "fullDescription", "highlights", "faqs"
  ];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
    }
  }

  // Validate arrays have minimum items
  if (!Array.isArray(data.tags) || data.tags.length < 1) {
    return NextResponse.json({ error: "Tags must have at least 1 item" }, { status: 400 });
  }
  
  if (!Array.isArray(data.neighborhoods) || data.neighborhoods.length < 1) {
    return NextResponse.json({ error: "Neighborhoods must have at least 1 item" }, { status: 400 });
  }
  
  if (!Array.isArray(data.highlights) || data.highlights.length < 1) {
    return NextResponse.json({ error: "Highlights must have at least 1 item" }, { status: 400 });
  }
  
  if (!Array.isArray(data.faqs) || data.faqs.length < 1) {
    return NextResponse.json({ error: "FAQs must have at least 1 item" }, { status: 400 });
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
  if (!data._id) return NextResponse.json({ error: "City ID required" }, { status: 400 });
  
  const client = await clientPromise;
  const db = client.db();
  const { _id, ...update } = data;
  update.updatedAt = new Date();
  
  // Prevent slug collision
  if (update.slug) {
    const existing = await db.collection(COLLECTION).findOne({ 
      slug: update.slug, 
      _id: { $ne: new ObjectId(_id) } 
    });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
  }
  
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(_id) }, 
    { $set: update }
  );
  
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { _id } = await req.json();
  if (!_id) return NextResponse.json({ error: "City ID required" }, { status: 400 });
  
  const client = await clientPromise;
  const db = client.db();
  await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(_id) });
  
  return NextResponse.json({ success: true });
} 