import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    console.log('🔄 GET /api/home called')
    
    // First try to get data from MongoDB
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected')
      
      const homeData = await db.collection('home').findOne({})
      
      if (homeData) {
        console.log('✅ Returning data from database')
        const { _id, ...cleanHomeData } = homeData // Remove _id field
        return NextResponse.json(cleanHomeData)
      }
    } catch (dbError) {
      console.log('⚠️ Database not available, falling back to JSON file:', dbError)
    }

    // Fallback to JSON file
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'home.json')
    if (fs.existsSync(jsonPath)) {
      console.log('✅ Returning data from JSON file')
      const jsonData = fs.readFileSync(jsonPath, 'utf8')
      return NextResponse.json(JSON.parse(jsonData))
    }

    // Return default structure if no data exists
    console.log('✅ Returning default data structure')
    return NextResponse.json({
      hero: {
        badge: "Global Luxury Real Estate",
        title: "Exclusive Properties for Discerning Clients",
        subtitle: "With over 20 years of experience, we connect international buyers with the finest properties across the world's most desirable locations.",
        viewProperties: "View Properties",
        contactUs: "Contact Us",
        scrollDown: "Scroll Down"
      },
      stats: {
        yearsExperience: "25+",
        billionInSales: "4.2B",
        countriesServed: "50+",
        clientSatisfaction: "100%"
      },
      services: {
        title: "Our Services",
        subtitle: "Comprehensive real estate solutions tailored to your unique needs.",
        propertyAcquisition: {
          title: "Property Acquisition",
          description: "Our global network and market expertise ensures you find the perfect property that meets all your requirements.",
          icon: "🏡"
        },
        investmentAdvisory: {
          title: "Investment Advisory",
          description: "Strategic guidance to maximize returns on your real estate investments with our data-driven approach.",
          icon: "💰"
        },
        relocationServices: {
          title: "Relocation Services",
          description: "Comprehensive support for international clients moving to new countries, including legal and logistical assistance.",
          icon: "🌎"
        }
      },
      cities: {
        title: "Explore California Cities",
        subtitle: "Discover the most desirable locations across the Golden State, each offering unique lifestyle opportunities and investment potential."
      },
      blog: {
        title: "Latest Insights",
        subtitle: "Discover our expert perspectives on luxury real estate markets worldwide."
      },
      cta: {
        title: "Ready to Find Your Dream Property?",
        text: "Contact our team of experts today for a personalized consultation and begin your journey to finding the perfect home or investment property.",
        button: "Schedule Consultation"
      }
    })
  } catch (error) {
    console.error('❌ Error fetching home data:', error)
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 PUT /api/home called')
    
    const homeData = await request.json()
    console.log('✅ Request body parsed:', JSON.stringify(homeData, null, 2))

    // Try to update MongoDB if available
    try {
      const { db } = await connectToDatabase()
      console.log('✅ Database connected')
      
      // Update the home data
      const result = await db.collection('home').updateOne(
        {}, // empty filter to match any document
        { $set: homeData },
        { upsert: true }
      )
      console.log('✅ Database update result:', result)
    } catch (dbError) {
      console.log('⚠️ Database not available, skipping database update:', dbError)
    }

    // Update the JSON file (remove _id field for frontend)
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'home.json')
    const { _id, ...homeDataForJson } = homeData // Remove _id field
    fs.writeFileSync(jsonPath, JSON.stringify(homeDataForJson, null, 2))
    console.log('✅ JSON file updated at:', jsonPath)

    // Set a flag to notify the home page to refresh
    // Note: This won't work in server-side code, but we'll handle it in the admin panel

    return NextResponse.json({ 
      message: 'Home data updated successfully',
      timestamp: Date.now() // Add timestamp to force cache invalidation
    })
  } catch (error) {
    console.error('❌ Error updating home data:', error)
    return NextResponse.json({ 
      error: 'Failed to update home data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
