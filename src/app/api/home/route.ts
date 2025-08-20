import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'

    // Try to return localized JSON from src/data/home/<locale>/home.json
    const localizedPath = path.join(process.cwd(), 'src', 'data', 'home', locale, 'home.json')
    if (fs.existsSync(localizedPath)) {
      const json = fs.readFileSync(localizedPath, 'utf8')
      return NextResponse.json(JSON.parse(json))
    }

    // Fallback to English JSON
    const enPath = path.join(process.cwd(), 'src', 'data', 'home', 'en', 'home.json')
    if (fs.existsSync(enPath)) {
      const json = fs.readFileSync(enPath, 'utf8')
      return NextResponse.json(JSON.parse(json))
    }

    // Final fallback: default structure (English)
    return NextResponse.json({
      hero: {
        badge: 'Premium Destination',
        title: 'Discover the Magic of Southern California',
        subtitle: 'From coastal sanctuaries to vibrant city residences, explore the most desirable locations in the region',
        explore: 'Explore Properties',
        contact: 'Contact Agent'
      },
      stats: {
        yearsExperience: 20,
        billionInSales: 3.2,
        countriesServed: 15,
        clientSatisfaction: 98
      },
      blog: {
        title: 'Latest Insights',
        subtitle: 'Discover our expert perspectives on luxury real estate markets worldwide.'
      },
      testimonials: {
        title: 'What Our Clients Say',
        subtitle: 'Real stories from families who found their dream homes with us',
        items: [
          {
            id: 't1',
            quote:
              'Working with Reza meant to be working with excellency! We had an incredible experience, due to his professionalism, was very knowledgeable, and truly invested his willingness and time in helping us find the place we chose.',
            author: 'Silvia Jacobo',
            rating: 5,
            image: '/clients/client1.png'
          },
          {
            id: 't2',
            quote:
              "Reza Barghlalmeno made buying our home such an incredible experience—one of the best we've had as a family, and I've been through quite a few home purchases in my 80+ years!",
            author: 'Fern Siegel',
            rating: 5,
            image: '/clients/client2.png'
          },
          {
            id: 't3',
            quote:
              'I recently had the pleasure of working with Reza and I cannot speak highly enough of the exceptional experience I had. From start to finish, Reza went above and beyond to ensure that my home buying process was as smooth as possible.',
            author: 'Maxim Gantman',
            rating: 5,
            image: '/clients/client3.png'
          }
        ]
      },
      cta: {
        title: 'Ready to Find Your Dream Property?',
        text: 'Contact our team of experts today for a personalized consultation and begin your journey to finding the perfect home or investment property.',
        button: 'Schedule Consultation'
      }
    })
  } catch (error) {
    console.error('❌ Error fetching home data:', error)
    return NextResponse.json({ error: 'Failed to fetch home data' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Not used in this change; keep existing implementation if needed in your project.
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update home data' }, { status: 500 })
  }
}
