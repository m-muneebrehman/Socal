import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { updateCitiesJsonFile } from '@/lib/json-updater'
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    console.log('Connecting to database...')
    const { db } = await connectToDatabase()
    console.log('Connected to database successfully')
    
    const cities = await db.collection('cities').find({}).toArray()
    console.log('Cities from database:', cities)
    console.log('Number of cities in database:', cities.length)
    
    // If database is empty, try to read from JSON file as fallback
    if (cities.length === 0) {
      console.log('Database is empty, checking JSON file...')
      try {
        const fs = require('fs')
        const path = require('path')
        const jsonPath = path.join(process.cwd(), 'src', 'data', 'cities.json')
        const jsonData = fs.readFileSync(jsonPath, 'utf8')
        const jsonCities = JSON.parse(jsonData)
        console.log('Cities from JSON file:', jsonCities)
        console.log('Number of cities in JSON file:', jsonCities.length)
        return NextResponse.json(jsonCities)
      } catch (jsonError) {
        console.error('Error reading JSON file:', jsonError)
      }
    }
    
    return NextResponse.json(cities)
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received city data:', body)
    
    // Validate required fields
    const requiredFields = ['slug', 'name', 'state', 'population', 'avgHomePrice', 'shortDescription']
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === '') {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }
    
    const { db } = await connectToDatabase()
    console.log('Connected to database')
    
    const cityData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('Inserting city data:', cityData)
    
    const result = await db.collection('cities').insertOne(cityData)
    console.log('City inserted with ID:', result.insertedId)

    // Update the JSON file after successful database insertion
    await updateCitiesJsonFile()
    console.log('JSON file updated')

    return NextResponse.json({ 
      message: 'City created successfully', 
      _id: result.insertedId 
    })
  } catch (error) {
    console.error('Error creating city:', error)
    return NextResponse.json({ 
      error: 'Failed to create city',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id, ...updateData } = body
    console.log('Updating city with ID:', _id)
    
    if (!_id) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(_id)) {
      console.error('Invalid ObjectId format:', _id)
      return NextResponse.json({ 
        error: 'Invalid city ID format',
        details: 'The provided ID is not a valid MongoDB ObjectId'
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    const result = await db.collection('cities').updateOne(
      { _id: new ObjectId(_id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    // Update the JSON file after successful database update
    await updateCitiesJsonFile()

    return NextResponse.json({ message: 'City updated successfully' })
  } catch (error) {
    console.error('Error updating city:', error)
    return NextResponse.json({ 
      error: 'Failed to update city',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { _id } = body
    console.log('Deleting city with ID:', _id)
    
    if (!_id) {
      return NextResponse.json({ error: 'City ID is required' }, { status: 400 })
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(_id)) {
      console.error('Invalid ObjectId format:', _id)
      return NextResponse.json({ 
        error: 'Invalid city ID format',
        details: 'The provided ID is not a valid MongoDB ObjectId'
      }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    const result = await db.collection('cities').deleteOne({ _id: new ObjectId(_id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    // Update the JSON file after successful database deletion
    await updateCitiesJsonFile()

    return NextResponse.json({ message: 'City deleted successfully' })
  } catch (error) {
    console.error('Error deleting city:', error)
    return NextResponse.json({ 
      error: 'Failed to delete city',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 