import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string } }
) {
  try {
    const { locale } = params
    
    // Construct the directory path for the locale
    const localeDir = path.join(process.cwd(), 'src', 'data', 'cities', locale)
    
    // Check if the directory exists
    if (!fs.existsSync(localeDir)) {
      return NextResponse.json(
        { error: 'Locale not found' },
        { status: 404 }
      )
    }
    
    // Read all JSON files in the directory
    const files = fs.readdirSync(localeDir)
    const cityFiles = files.filter(file => file.endsWith('.json'))
    
    const cities = []
    
    for (const file of cityFiles) {
      try {
        const filePath = path.join(localeDir, file)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const cityData = JSON.parse(fileContent)
        
        // Extract only the fields needed for the listing
        const cityListing = {
          slug: cityData.slug,
          name: cityData.name,
          state: cityData.state,
          shortDescription: cityData.shortDescription,
          heroImage: cityData.heroImage,
          population: cityData.population,
          avgHomePrice: cityData.avgHomePrice,
          tags: cityData.tags || [],
          neighborhoods: cityData.neighborhoods || [],
          county: cityData.county || null
        }
        
        cities.push(cityListing)
      } catch (error) {
        console.error(`Error reading city file ${file}:`, error)
        // Continue with other files
      }
    }
    
    return NextResponse.json(cities)
  } catch (error) {
    console.error('Error reading cities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
