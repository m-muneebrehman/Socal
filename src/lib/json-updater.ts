import fs from 'fs'
import path from 'path'
import { connectToDatabase } from './mongodb'
import { City, Blog, User, HomeData } from '@/types'

export interface CityDocForFile {
  slug: string
  name: string
  state: string
  language?: string
  shortDescription: string
  fullDescription?: string
  heroImage?: string
  heroImageAlt?: string
  population: string
  avgHomePrice: string
  tags?: string[]
  neighborhoods?: Array<{
    name: string
    type: 'neighborhood' | 'city'
    slug: string
    description: string
    image: string
    imageAlt?: string
    distance: string
    avgHomePrice: string
    county: string
  }>
  highlights?: Array<{
    title: string
    description: string
    icon: string
    bgImage: string
    bgImageAlt?: string
  }>
  faqs?: Array<{
    question: string
    answer: string
    category: string
  }>
  clients?: Array<{
    name: string
    description: string
    image: string
    imageAlt?: string
    rating: number
    review: string
  }>
  canonicalUrl?: string
  hreflang_tags?: Array<{
    hreflang: string
    href: string
  }>
  seo?: {
    metaTitle: string
    metaDescription: string
    keywords?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogImageAlt?: string
    twitterCard?: string
  }
  schema_markup?: object[]
  internal_links?: Array<{
    href: string
    anchor: string
    context?: string
  }>
  // New fields from the updated structure
  city?: string
  county?: string
  url_slug?: string
  meta_title?: string
  meta_description?: string
  h1_title?: string
  primary_keywords?: string[]
  secondary_keywords?: string[]
  express_keywords?: string[]
  agent_keywords?: string[]
  landing_page_text?: string
  express_service?: string
  neighborhood_guide?: string
  market_analysis?: string
  agent_name?: string
  cta_text?: string
  contact_phone?: string
  contact_email?: string
  company_name?: string
  updatedAt?: string
}

function ensureDirSync(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

export async function writeCityFile(city: CityDocForFile) {
  const language = city.language || 'en'
  const fileDir = path.join(process.cwd(), 'src', 'data', 'cities', language)
  const filePath = path.join(fileDir, `${city.slug}.json`)
  ensureDirSync(fileDir)
  // Only persist the exact public JSON shape (include language field below state)
  const dataToWrite = {
    slug: city.slug,
    name: city.name,
    state: city.state,
    language: city.language || 'en',
    shortDescription: city.shortDescription,
    fullDescription: city.fullDescription ?? city.shortDescription,
    heroImage: city.heroImage ?? '',
    heroImageAlt: city.heroImageAlt ?? '',
    population: city.population,
    avgHomePrice: city.avgHomePrice,
    tags: Array.isArray(city.tags) ? city.tags : [],
    neighborhoods: Array.isArray(city.neighborhoods) ? city.neighborhoods : [],
    highlights: Array.isArray(city.highlights) ? city.highlights : [],
    faqs: Array.isArray(city.faqs) ? city.faqs : [],
    seo: city.seo ?? {},
    schema_markup: Array.isArray(city.schema_markup) ? city.schema_markup : [],
    // New fields
    city: city.city || city.name,
    county: city.county || city.state,
    url_slug: city.url_slug || `/real-estate-${city.slug}`,
    meta_title: city.meta_title || `Buy & Sell Homes in ${city.name} | Prime Local Homes - Reza Barghlameno`,
    meta_description: city.meta_description || `Expert ${city.name} real estate service with Reza Barghlameno. Find homes for sale, get market analysis. Express service available for urgent buyers.`,
    h1_title: city.h1_title || `${city.name} Real Estate Expert - Buy & Sell with Reza Barghlameno`,
    primary_keywords: Array.isArray(city.primary_keywords) ? city.primary_keywords : [`${city.name} real estate`, `homes for sale in ${city.name}`, `buy house in ${city.name}`, `sell home in ${city.name}`, `Prime Local Homes ${city.name}`, `Reza Barghlameno ${city.name}`],
    secondary_keywords: Array.isArray(city.secondary_keywords) ? city.secondary_keywords : [`best realtor in ${city.name}`, `luxury homes in ${city.name}`, `condos for sale in ${city.name}`, `single family homes in ${city.name}`, `townhomes in ${city.name}`, `new listings ${city.name}`, `property market ${city.name}`, `real estate trends ${city.name}`],
    express_keywords: Array.isArray(city.express_keywords) ? city.express_keywords : [`fast home buying ${city.name}`, `urgent house search ${city.name}`, `express real estate service ${city.name}`, `same day home finding ${city.name}`, `quick house purchase ${city.name}`, `emergency realtor ${city.name}`, `weekend home buying ${city.name}`, `family emergency home search ${city.name}`],
    agent_keywords: Array.isArray(city.agent_keywords) ? city.agent_keywords : [`Reza Barghlameno`, `Reza Barghlameno realtor`, `Reza Barghlameno ${city.name}`, `Reza Barghlameno real estate agent`, `Reza Barghlameno Prime Local Homes`, `top realtor ${city.name} Reza Barghlameno`],
    landing_page_text: city.landing_page_text || `Welcome to ${city.name}, ${city.state} - one of ${city.county || city.state} County's most sought-after communities for homebuyers and sellers. Reza Barghlameno, your trusted ${city.name} real estate expert with Prime Local Homes, brings over 20 years of experience to guide you through every aspect of your real estate journey.`,
    express_service: city.express_service || `When life demands immediate housing solutions, Reza Barghlameno's Express Service delivers results with unmatched speed and reliability in ${city.name}. Understanding that time is often of the essence, especially in today's fast-paced world, Reza offers a dedicated 48-72 hour home finding service.`,
    neighborhood_guide: city.neighborhood_guide || `${city.name} is home to several distinct neighborhoods, each offering unique benefits for different types of buyers. Reza Barghlameno's insights into these neighborhoods can help you find the perfect fit for your lifestyle and needs.`,
    market_analysis: city.market_analysis || `The ${city.name} real estate market is currently thriving, with a noticeable increase in home values over the past year. This growth is driven by a combination of low inventory and high demand, making it a competitive market for buyers.`,
    agent_name: city.agent_name || 'Reza Barghlameno',
    cta_text: city.cta_text || `Ready to buy or sell in ${city.name}? Contact Reza Barghlameno today for expert guidance and express service when you need it most.`,
    contact_phone: city.contact_phone || '+1 858-305-4362',
    contact_email: city.contact_email || 'reza@socalprimehomes.com',
    company_name: city.company_name || 'socalprimehomes.com',
    updatedAt: new Date().toISOString()
  }
  fs.writeFileSync(filePath, JSON.stringify(dataToWrite, null, 2))
  console.log(`✅ Wrote city file: ${filePath}`)
}

export async function deleteCityFileBySlugLanguage(slug: string, language?: string) {
  const lang = language || 'en'
  const filePath = path.join(process.cwd(), 'src', 'data', 'cities', lang, `${slug}.json`)
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`✅ Deleted city file: ${filePath}`)
    } else {
      console.log(`ℹ️ City file not found to delete: ${filePath}`)
    }
  } catch (err) {
    console.error('❌ Error deleting city file:', err)
  }
}

// Function to update blogs.json files for each language (no global file)
export async function updateBlogsJsonFile() {
  try {
    console.log('🔄 Starting updateBlogsJsonFile...')
    const { db } = await connectToDatabase()
    const blogs = await db.collection('blogs').find({}).toArray()
    console.log(`📊 Found ${blogs.length} blogs in database`)
    
    // Group blogs by language
    const blogsByLanguage: { [key: string]: Blog[] } = {}
    
    blogs.forEach(blog => {
      const language = blog.language || 'en'
      if (!blogsByLanguage[language]) {
        blogsByLanguage[language] = []
      }
      
      // Only include published blogs
      if (blog.status === 'Published') {
        // Transform the data to match the expected format
        const transformedBlog = {
          id: blog._id.toString(),
          slug: blog.slug,
          title: blog.title,
          subtitle: blog.subtitle || '',
          category: blog.category,
          author: blog.author,
          date: blog.date,
          readTime: blog.readTime || '5 min read',
          status: blog.status,
          featured: blog.featured || false,
          heroImage: blog.heroImage || '',
          heroImageAlt: blog.heroImageAlt || '',
          canonicalUrl: blog.canonicalUrl || '',
          language: blog.language || 'en',
          city: blog.city || '',
          topic: blog.topic || '',
          keyword: blog.keyword || '',
          group_id: blog.group_id || 1,
          seo: blog.seo || {
            metaTitle: '',
            metaDescription: '',
            keywords: '',
            ogTitle: '',
            ogDescription: '',
            ogImage: '',
            twitterCard: ''
          },
          hreflang_tags: blog.hreflang_tags || [],
          internal_links: blog.internal_links || [],
          schema_markup: blog.schema_markup || {},
          images: blog.images || [],
          word_count: blog.word_count || 0,
          ctaSection: blog.ctaSection || {
            title: '',
            subtitle: '',
            ctaText: '',
            ctaLink: ''
          },
          content: blog.content || { lead: '', sections: [] },
          views: blog.views || 0,
          likes: blog.likes || 0,
          createdAt: blog.createdAt || new Date().toISOString(),
          updatedAt: blog.updatedAt || new Date().toISOString()
        }
        
        blogsByLanguage[language].push(transformedBlog)
      }
    })
    
    // Write language-specific JSON files only
    for (const [language, blogs] of Object.entries(blogsByLanguage)) {
      const languageDir = path.join(process.cwd(), 'src', 'data', 'blogs', language)
      ensureDirSync(languageDir)
      
      const jsonPath = path.join(languageDir, 'blogs.json')
      fs.writeFileSync(jsonPath, JSON.stringify(blogs, null, 2))
      console.log(`✅ blogs.json updated for language: ${language} (${blogs.length} published blogs)`)
    }
    
    console.log('✅ All language-specific blog JSON files updated successfully')
  } catch (error) {
    console.error('❌ Error updating blog JSON files:', error)
    throw error
  }
}

// Function to update blog JSON file for a specific language only
export async function updateBlogsJsonFileByLanguage(language: string) {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection('blogs')
      .find({ 
        language: language,
        status: 'Published'
      })
      .toArray()
    
    // Transform the data to match the expected format
    const transformedBlogs = blogs.map(blog => ({
      id: blog._id.toString(),
      slug: blog.slug,
      title: blog.title,
      subtitle: blog.subtitle || '',
      category: blog.category,
      author: blog.author,
      date: blog.date,
      readTime: blog.readTime || '5 min read',
      status: blog.status,
      featured: blog.featured || false,
      heroImage: blog.heroImage || '',
      heroImageAlt: blog.heroimagealt || '',
      canonicalUrl: blog.canonicalurl || '',
      language: blog.language || 'en',
      city: blog.city || '',
      topic: blog.topic || '',
      keyword: blog.keyword || '',
      group_id: blog.group_id || 1,
      seo: blog.seo || {
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterCard: ''
      },
      hreflang_tags: blog.hreflang_tags || [],
      internal_links: blog.internal_links || [],
      schema_markup: blog.schema_markup || {},
      images: blog.images || [],
      word_count: blog.wordcount || 0,
      ctaSection: blog.ctaSection || {
        title: '',
        subtitle: '',
        ctaText: '',
        ctaLink: ''
      },
      content: blog.content || { lead: '', sections: [] },
      views: blog.views || 0,
      likes: blog.likes || 0,
      createdAt: blog.createdAt || new Date().toISOString(),
      updatedAt: blog.updatedAt || new Date().toISOString()
    }))
    
    // Write language-specific JSON file
    const languageDir = path.join(process.cwd(), 'src', 'data', 'blogs', language)
    ensureDirSync(languageDir)
    
    const jsonPath = path.join(languageDir, 'blogs.json')
    fs.writeFileSync(jsonPath, JSON.stringify(transformedBlogs, null, 2))
    console.log(`✅ blogs.json updated for language: ${language} (${transformedBlogs.length} published blogs)`)
    
  } catch (error) {
    console.error(`❌ Error updating blogs.json for language ${language}:`, error)
  }
}

// Function to update users.json file
export async function updateUsersJsonFile() {
  try {
    console.log('🔄 Starting updateUsersJsonFile...')
    const { db } = await connectToDatabase()
    console.log('📡 Connected to database')
    
    const users = await db.collection('users').find({}).toArray()
    console.log('📊 Raw users from MongoDB:', JSON.stringify(users, null, 2))
    
    if (!users || users.length === 0) {
      console.log('⚠️ No users found in MongoDB')
      // Write empty array to JSON file
      const jsonPath = path.join(process.cwd(), 'src', 'data', 'users.json')
      fs.writeFileSync(jsonPath, JSON.stringify([], null, 2))
      console.log('✅ users.json updated with empty array')
      return
    }
    
    // Transform the data to match the expected format
    const transformedUsers = users.map(user => {
      console.log('🔄 Processing user:', user)
      
      if (!user._id) {
        console.error('❌ User missing _id:', user)
        return null
      }
      
      const transformedUser = {
        id: user._id.toString(),
        email: user.email,
        role: user.role || 'User',
        status: user.status || 'Active',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
      
      console.log('✅ Transformed user:', transformedUser)
      return transformedUser
    }).filter(user => user !== null) // Remove any null entries

    console.log('📝 Final transformed users for JSON:', JSON.stringify(transformedUsers, null, 2))

    // Write to users.json file
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'users.json')
    fs.writeFileSync(jsonPath, JSON.stringify(transformedUsers, null, 2))
    
    console.log('✅ users.json updated successfully')
  } catch (error) {
    console.error('❌ Error updating users.json:', error)
    console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error')
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    throw error
  }
}

// Function to update all JSON files (only language-specific directories)
export async function updateAllJsonFiles() {
  try {
    console.log('🔄 Starting comprehensive JSON update...')
    
    // Update users.json (keep this as it's needed for admin functionality)
    await updateUsersJsonFile()
    
    // Update language-specific blog files
    await updateBlogsJsonFile()
    
    // Update individual city files for each language
    await updateIndividualCityFiles()
    
    // Update home data for each language
    await updateHomeDataForAllLanguages()
    
    console.log('✅ All language-specific JSON files updated successfully')
  } catch (error) {
    console.error('❌ Error in updateAllJsonFiles:', error)
    throw error
  }
}

// Function to update all blog-related JSON files
export async function updateAllBlogJsonFiles() {
  await updateBlogsJsonFile()
  console.log('✅ All language-specific blog JSON files updated successfully')
}

// Function to update JSON files for a specific language only
export async function updateJsonFilesForLanguage(language: string) {
  try {
    console.log(`🔄 Starting JSON update for language: ${language}`)
    
    // Update language-specific files
    await Promise.all([
      updateBlogsJsonFileByLanguage(language),
      updateHomeDataForLanguage(language)
    ])
    
    // Update individual city files for this language
    await updateIndividualCityFilesForLanguage(language)
    
    console.log(`✅ JSON files updated successfully for language: ${language}`)
  } catch (error) {
    console.error(`❌ Error updating JSON files for language ${language}:`, error)
    throw error
  }
}

// Function to update individual city files for a specific language
export async function updateIndividualCityFilesForLanguage(language: string) {
  try {
    console.log(`🔄 Starting updateIndividualCityFilesForLanguage for: ${language}`)
    const { db } = await connectToDatabase()
    
    // Get cities for this specific language
    const cities = await db.collection('cities').find({ language: language }).toArray()
    console.log(`📊 Found ${cities.length} cities for language: ${language}`)
    
    const languageDir = path.join(process.cwd(), 'src', 'data', 'cities', language)
    ensureDirSync(languageDir)
    
    // Process each city in this language
    for (const city of cities) {
      const cityData: CityDocForFile = {
        slug: city.slug,
        name: city.name,
        state: city.state,
        language: city.language || 'en',
        shortDescription: city.shortDescription,
        fullDescription: city.fullDescription || city.shortDescription,
        heroImage: city.heroImage || '',
        heroImageAlt: city.heroImageAlt || '',
        population: city.population,
        avgHomePrice: city.avgHomePrice,
        tags: Array.isArray(city.tags) ? city.tags : [],
        neighborhoods: Array.isArray(city.neighborhoods) ? city.neighborhoods : [],
        highlights: Array.isArray(city.highlights) ? city.highlights : [],
        faqs: Array.isArray(city.faqs) ? city.faqs : [],
        clients: city.clients || [],
        canonicalUrl: city.canonicalUrl || '',
        hreflang_tags: city.hreflang_tags || [],
        seo: city.seo || {},
        schema_markup: city.schema_markup || [],
        internal_links: city.internal_links || [],
        // New fields
        city: city.city || city.name,
        county: city.county || city.state,
        url_slug: city.url_slug || `/real-estate-${city.slug}`,
        meta_title: city.meta_title || `Buy & Sell Homes in ${city.name} | Prime Local Homes - Reza Barghlameno`,
        meta_description: city.meta_description || `Expert ${city.name} real estate service with Reza Barghlameno. Find homes for sale, get market analysis. Express service available for urgent buyers.`,
        h1_title: city.h1_title || `${city.name} Real Estate Expert - Buy & Sell with Reza Barghlameno`,
        primary_keywords: city.primary_keywords || [`${city.name} real estate`, `homes for sale in ${city.name}`, `buy house in ${city.name}`, `sell home in ${city.name}`, `Prime Local Homes ${city.name}`, `Reza Barghlameno ${city.name}`],
        secondary_keywords: city.secondary_keywords || [`best realtor in ${city.name}`, `luxury homes in ${city.name}`, `condos for sale in ${city.name}`, `single family homes in ${city.name}`, `townhomes in ${city.name}`, `new listings ${city.name}`, `property market ${city.name}`, `real estate trends ${city.name}`],
        express_keywords: city.express_keywords || [`fast home buying ${city.name}`, `urgent house search ${city.name}`, `express real estate service ${city.name}`, `same day home finding ${city.name}`, `quick house purchase ${city.name}`, `emergency realtor ${city.name}`, `weekend home buying ${city.name}`, `family emergency home search ${city.name}`],
        agent_keywords: city.agent_keywords || [`Reza Barghlameno`, `Reza Barghlameno realtor`, `Reza Barghlameno ${city.name}`, `Reza Barghlameno real estate agent`, `Reza Barghlameno Prime Local Homes`, `top realtor ${city.name} Reza Barghlameno`],
        landing_page_text: city.landing_page_text || `Welcome to ${city.name}, ${city.state} - one of ${city.county || city.state} County's most sought-after communities for homebuyers and sellers. Reza Barghlameno, your trusted ${city.name} real estate expert with Prime Local Homes, brings over 20 years of experience to guide you through every aspect of your real estate journey.`,
        express_service: city.express_service || `When life demands immediate housing solutions, Reza Barghlameno's Express Service delivers results with unmatched speed and reliability in ${city.name}. Understanding that time is often of the essence, especially in today's fast-paced world, Reza offers a dedicated 48-72 hour home finding service.`,
        neighborhood_guide: city.neighborhood_guide || `${city.name} is home to several distinct neighborhoods, each offering unique benefits for different types of buyers. Reza Barghlameno's insights into these neighborhoods can help you find the perfect fit for your lifestyle and needs.`,
        market_analysis: city.market_analysis || `The ${city.name} real estate market is currently thriving, with a noticeable increase in home values over the past year. This growth is driven by a combination of low inventory and high demand, making it a competitive market for buyers.`,
        agent_name: city.agent_name || 'Reza Barghlameno',
        cta_text: city.cta_text || `Ready to buy or sell in ${city.name}? Contact Reza Barghlameno today for expert guidance and express service when you need it most.`,
        contact_phone: city.contact_phone || '+1 858-305-4362',
        contact_email: city.contact_email || 'reza@socalprimehomes.com',
        company_name: city.company_name || 'socalprimehomes.com',
        updatedAt: new Date().toISOString()
      }
      
      await writeCityFile(cityData)
    }
    
    console.log(`✅ Updated ${cities.length} city files for language: ${language}`)
  } catch (error) {
    console.error(`❌ Error updating individual city files for language ${language}:`, error)
    throw error
  }
}

// Function to update home data for a specific language
export async function updateHomeDataForLanguage(language: string) {
  try {
    console.log(`🔄 Starting updateHomeDataForLanguage for: ${language}`)
    const { db } = await connectToDatabase()
    
    // Get home data for this specific language
    const homeData = await db.collection('home').findOne({ language: language })
    
    if (!homeData) {
      console.log(`⚠️ No home data found for language: ${language}`)
      return
    }
    
    const languageDir = path.join(process.cwd(), 'src', 'data', 'home', language)
    ensureDirSync(languageDir)
    
    const jsonPath = path.join(languageDir, 'home.json')
    
    // Clean up the data to match the expected format
    const cleanHomeData = {
      hero: homeData.hero || {},
      stats: homeData.stats || {},
      services: homeData.services || {},
      cities: homeData.cities || {},
      blog: homeData.blog || {},
      testimonials: homeData.testimonials || {},
      cta: homeData.cta || {}
    }
    
    fs.writeFileSync(jsonPath, JSON.stringify(cleanHomeData, null, 2))
    console.log(`✅ Updated home.json for language: ${language}`)
  } catch (error) {
    console.error(`❌ Error updating home data for language ${language}:`, error)
    throw error
  }
}

// Function to update individual city files for each language
export async function updateIndividualCityFiles() {
  try {
    console.log('🔄 Starting updateIndividualCityFiles...')
    const { db } = await connectToDatabase()
    
    // Get all cities from the database
    const cities = await db.collection('cities').find({}).toArray()
    console.log(`📊 Found ${cities.length} cities in database`)
    
    // Group cities by language
    const citiesByLanguage: { [key: string]: any[] } = {}
    
    cities.forEach(city => {
      const language = city.language || 'en'
      if (!citiesByLanguage[language]) {
        citiesByLanguage[language] = []
      }
      citiesByLanguage[language].push(city)
    })
    
    // Update individual city files for each language
    for (const [language, citiesInLang] of Object.entries(citiesByLanguage)) {
      console.log(`🌍 Processing language: ${language} with ${citiesInLang.length} cities`)
      
      const languageDir = path.join(process.cwd(), 'src', 'data', 'cities', language)
      ensureDirSync(languageDir)
      
      // Process each city in this language
      for (const city of citiesInLang) {
        const cityData: CityDocForFile = {
          slug: city.slug,
          name: city.name,
          state: city.state,
          language: city.language || 'en',
          shortDescription: city.shortDescription,
          fullDescription: city.fullDescription || city.shortDescription,
          heroImage: city.heroImage || '',
          heroImageAlt: city.heroImageAlt || '',
          population: city.population,
          avgHomePrice: city.avgHomePrice,
          tags: Array.isArray(city.tags) ? city.tags : [],
          neighborhoods: Array.isArray(city.neighborhoods) ? city.neighborhoods : [],
          highlights: Array.isArray(city.highlights) ? city.highlights : [],
          faqs: Array.isArray(city.faqs) ? city.faqs : [],
          clients: city.clients || [],
          canonicalUrl: city.canonicalUrl || '',
          hreflang_tags: city.hreflang_tags || [],
          seo: city.seo || {},
          schema_markup: city.schema_markup || [],
          internal_links: city.internal_links || [],
          // New fields
          city: city.city || city.name,
          county: city.county || city.state,
          url_slug: city.url_slug || `/real-estate-${city.slug}`,
          meta_title: city.meta_title || `Buy & Sell Homes in ${city.name} | Prime Local Homes - Reza Barghlameno`,
          meta_description: city.meta_description || `Expert ${city.name} real estate service with Reza Barghlameno. Find homes for sale, get market analysis. Express service available for urgent buyers.`,
          h1_title: city.h1_title || `${city.name} Real Estate Expert - Buy & Sell with Reza Barghlameno`,
          primary_keywords: city.primary_keywords || [`${city.name} real estate`, `homes for sale in ${city.name}`, `buy house in ${city.name}`, `sell home in ${city.name}`, `Prime Local Homes ${city.name}`, `Reza Barghlameno ${city.name}`],
          secondary_keywords: city.secondary_keywords || [`best realtor in ${city.name}`, `luxury homes in ${city.name}`, `condos for sale in ${city.name}`, `single family homes in ${city.name}`, `townhomes in ${city.name}`, `new listings ${city.name}`, `property market ${city.name}`, `real estate trends ${city.name}`],
          express_keywords: city.express_keywords || [`fast home buying ${city.name}`, `urgent house search ${city.name}`, `express real estate service ${city.name}`, `same day home finding ${city.name}`, `quick house purchase ${city.name}`, `emergency realtor ${city.name}`, `weekend home buying ${city.name}`, `family emergency home search ${city.name}`],
          agent_keywords: city.agent_keywords || [`Reza Barghlameno`, `Reza Barghlameno realtor`, `Reza Barghlameno ${city.name}`, `Reza Barghlameno real estate agent`, `Reza Barghlameno Prime Local Homes`, `top realtor ${city.name} Reza Barghlameno`],
          landing_page_text: city.landing_page_text || `Welcome to ${city.name}, ${city.state} - one of ${city.county || city.state} County's most sought-after communities for homebuyers and sellers. Reza Barghlameno, your trusted ${city.name} real estate expert with Prime Local Homes, brings over 20 years of experience to guide you through every aspect of your real estate journey.`,
          express_service: city.express_service || `When life demands immediate housing solutions, Reza Barghlameno's Express Service delivers results with unmatched speed and reliability in ${city.name}. Understanding that time is often of the essence, especially in today's fast-paced world, Reza offers a dedicated 48-72 hour home finding service.`,
          neighborhood_guide: city.neighborhood_guide || `${city.name} is home to several distinct neighborhoods, each offering unique benefits for different types of buyers. Reza Barghlameno's insights into these neighborhoods can help you find the perfect fit for your lifestyle and needs.`,
          market_analysis: city.market_analysis || `The ${city.name} real estate market is currently thriving, with a noticeable increase in home values over the past year. This growth is driven by a combination of low inventory and high demand, making it a competitive market for buyers.`,
          agent_name: city.agent_name || 'Reza Barghlameno',
          cta_text: city.cta_text || `Ready to buy or sell in ${city.name}? Contact Reza Barghlameno today for expert guidance and express service when you need it most.`,
          contact_phone: city.contact_phone || '+1 858-305-4362',
          contact_email: city.contact_email || 'reza@socalprimehomes.com',
          company_name: city.company_name || 'socalprimehomes.com',
          updatedAt: new Date().toISOString()
        }
        
        await writeCityFile(cityData)
      }
      
      console.log(`✅ Updated ${citiesInLang.length} city files for language: ${language}`)
    }
    
    console.log('✅ All individual city files updated successfully')
  } catch (error) {
    console.error('❌ Error updating individual city files:', error)
    throw error
  }
}

// Function to update home data for all languages (no global file)
export async function updateHomeDataForAllLanguages() {
  try {
    console.log('🔄 Starting updateHomeDataForAllLanguages...')
    const { db } = await connectToDatabase()
    
    // Get all home data from the database
    const homeDataCollection = await db.collection('home').find({}).toArray()
    console.log(`📊 Found ${homeDataCollection.length} home data entries in database`)
    
    // Group home data by language
    const homeDataByLanguage: { [key: string]: any } = {}
    
    homeDataCollection.forEach(homeDoc => {
      const language = homeDoc.language || 'en'
      homeDataByLanguage[language] = homeDoc
    })
    
    // Update home.json files for each language only
    for (const [language, homeData] of Object.entries(homeDataByLanguage)) {
      console.log(`🏠 Processing home data for language: ${language}`)
      
      const languageDir = path.join(process.cwd(), 'src', 'data', 'home', language)
      ensureDirSync(languageDir)
      
      const jsonPath = path.join(languageDir, 'home.json')
      
      // Clean up the data to match the expected format
      const cleanHomeData = {
        hero: homeData.hero || {},
        stats: homeData.stats || {},
        services: homeData.services || {},
        cities: homeData.cities || {},
        blog: homeData.blog || {},
        testimonials: homeData.testimonials || {},
        cta: homeData.cta || {}
      }
      
      fs.writeFileSync(jsonPath, JSON.stringify(cleanHomeData, null, 2))
      console.log(`✅ Updated home.json for language: ${language}`)
    }
    
    console.log('✅ All language-specific home data files updated successfully')
  } catch (error) {
    console.error('❌ Error updating home data files:', error)
    throw error
  }
}
