import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { locale: string; slug: string } }
) {
  try {
    const { locale, slug } = params

    // Construct the file path
    const filePath = path.join(process.cwd(), 'src', 'data', 'counties', locale, `${slug}.json`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'County not found' },
        { status: 404 }
      )
    }

    // Read the county data
    const countyData = fs.readFileSync(filePath, 'utf8')
    const county = JSON.parse(countyData)

    return NextResponse.json(county)
  } catch (error) {
    console.error('Error fetching county data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
