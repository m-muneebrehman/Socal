import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('🧪 Testing database connection...')
    console.log('📡 DATABASE_URI:', process.env.DATABASE_URI ? 'Set' : 'Not set')
    console.log('📡 MONGODB_DB:', process.env.MONGODB_DB || 'Not set')
    
    const { db } = await connectToDatabase()
    console.log('✅ Connected to database:', db.databaseName)
    
    // Test inserting a simple document
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Database connection test'
    }
    
    const result = await db.collection('test').insertOne(testDoc)
    console.log('✅ Test document created with _id:', result.insertedId)
    
    // Retrieve the test document
    const retrievedDoc = await db.collection('test').findOne({ _id: result.insertedId })
    console.log('✅ Retrieved test document:', JSON.stringify(retrievedDoc, null, 2))
    
    // Clean up - delete the test document
    await db.collection('test').deleteOne({ _id: result.insertedId })
    console.log('✅ Test document cleaned up')
    
    return NextResponse.json({ 
      success: true, 
      database: db.databaseName,
      testId: result.insertedId.toString(),
      message: 'Database connection working properly'
    })
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 