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
    console.log('📝 Creating blog with data:', JSON.stringify(body, null, 2))
    
    // Validate required fields
    const requiredFields = ['slug', 'title', 'category', 'author', 'status']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }
    
    console.log('📡 Connecting to database...')
    const { db } = await connectToDatabase()
    console.log('📡 Connected to database:', db.databaseName)
    
    const blogData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('📝 Blog data to insert:', JSON.stringify(blogData, null, 2))
    
    console.log('📝 Inserting blog into collection...')
    const result = await db.collection('blogs').insertOne(blogData)
    
    console.log('✅ Blog created with _id:', result.insertedId)
    console.log('✅ Inserted ID type:', typeof result.insertedId)
    console.log('✅ Inserted ID value:', result.insertedId.toString())

    // Verify the blog was actually created
    console.log('📝 Verifying blog creation...')
    const createdBlog = await db.collection('blogs').findOne({ _id: result.insertedId })
    console.log('✅ Retrieved created blog:', JSON.stringify(createdBlog, null, 2))

    if (!createdBlog) {
      throw new Error('Blog was not created properly in database')
    }

    // Add a small delay to ensure database write is complete
    await new Promise(resolve => setTimeout(resolve, 100))

    // Update the JSON file after successful database insertion
    console.log('📝 Updating JSON file...')
    await updateBlogsJsonFile()

    return NextResponse.json({ 
      message: 'Blog created successfully', 
      _id: result.insertedId 
    })
  } catch (error) {
    console.error('❌ Error creating blog:', error)
    console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: 'Failed to create blog',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
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