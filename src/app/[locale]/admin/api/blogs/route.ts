import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { updateBlogsJsonFile } from '@/lib/json-updater'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection('blogs').find({}).toArray()
    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()
    
    const result = await db.collection('blogs').insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    // Update the JSON file after successful database insertion
    await updateBlogsJsonFile()

    return NextResponse.json({ 
      message: 'Blog created successfully', 
      _id: result.insertedId 
    })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id, ...updateData } = body
    const { db } = await connectToDatabase()
    
    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(_id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Update the JSON file after successful database update
    await updateBlogsJsonFile()

    return NextResponse.json({ message: 'Blog updated successfully' })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id } = body
    const { db } = await connectToDatabase()
    
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(_id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    // Update the JSON file after successful database deletion
    await updateBlogsJsonFile()

    return NextResponse.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}