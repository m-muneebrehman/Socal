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
    
    // Validate required fields according to new comprehensive schema
    const requiredFields = [
      'slug', 'name', 'state', 'population', 'avgHomePrice', 'shortDescription',
      'fullDescription', 'heroImage', 'heroImageAlt', 'canonicalUrl', 'tags',
      'neighborhoods', 'highlights', 'faqs', 'clients', 'hreflang_tags', 'seo',
      'schema_markup', 'internal_links'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 })
      }
    }
    
    // Validate highlights structure
    if (!Array.isArray(body.highlights) || body.highlights.length === 0) {
      return NextResponse.json({ 
        error: 'Highlights must be a non-empty array' 
      }, { status: 400 })
    }
    
    for (const highlight of body.highlights) {
      if (!highlight.title || !highlight.description || !highlight.icon || !highlight.bgImage) {
        return NextResponse.json({ 
          error: 'Each highlight must include title, description, icon, and bgImage' 
        }, { status: 400 })
      }
    }
    
    // Validate FAQs structure
    if (!Array.isArray(body.faqs) || body.faqs.length === 0) {
      return NextResponse.json({ 
        error: 'FAQs must be a non-empty array' 
      }, { status: 400 })
    }
    
    for (const faq of body.faqs) {
      if (!faq.question || !faq.answer || !faq.category) {
        return NextResponse.json({ 
          error: 'Each FAQ must include question, answer, and category' 
        }, { status: 400 })
      }
    }
    
    // Validate clients structure
    if (!Array.isArray(body.clients) || body.clients.length === 0) {
      return NextResponse.json({ 
        error: 'Clients must be a non-empty array' 
      }, { status: 400 })
    }
    
    for (const client of body.clients) {
      if (!client.name || !client.description || !client.image || !client.review) {
        return NextResponse.json({ 
          error: 'Each client must include name, description, image, and review' 
        }, { status: 400 })
      }
    }
    
    // Validate SEO object
    if (!body.seo.metaTitle || !body.seo.metaDescription) {
      return NextResponse.json({ 
        error: 'SEO object must include metaTitle and metaDescription' 
      }, { status: 400 })
    }
    
    // Validate hreflang tags
    if (!Array.isArray(body.hreflang_tags) || body.hreflang_tags.length === 0) {
      return NextResponse.json({ 
        error: 'Hreflang tags must be a non-empty array' 
      }, { status: 400 })
    }
    
    for (const tag of body.hreflang_tags) {
      if (!tag.hreflang || !tag.href) {
        return NextResponse.json({ 
          error: 'Each hreflang tag must include hreflang and href' 
        }, { status: 400 })
      }
    }
    
    // Validate schema markup
    if (!Array.isArray(body.schema_markup) || body.schema_markup.length === 0) {
      return NextResponse.json({ 
        error: 'Schema markup must be a non-empty array' 
      }, { status: 400 })
    }
    
    // Validate internal links
    if (!Array.isArray(body.internal_links) || body.internal_links.length === 0) {
      return NextResponse.json({ 
        error: 'Internal links must be a non-empty array' 
      }, { status: 400 })
    }
    
    for (const link of body.internal_links) {
      if (!link.href || !link.anchor) {
        return NextResponse.json({ 
          error: 'Each internal link must include href and anchor' 
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