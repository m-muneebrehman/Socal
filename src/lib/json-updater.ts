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
  // Only persist the exact public JSON shape (no language inside file; exclude legacy fields)
  const dataToWrite = {
    slug: city.slug,
    name: city.name,
    state: city.state,
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
    schema_markup: Array.isArray(city.schema_markup) ? city.schema_markup : []
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

// Function to update cities.json file
export async function updateCitiesJsonFile() {
  try {
    const { db } = await connectToDatabase()
    const cities = await db.collection('cities').find({}).toArray()
    
    // Transform the data to match the expected format
    const transformedCities = cities.map(city => ({
      id: city._id.toString(),
      slug: city.slug,
      name: city.name,
      state: city.state,
      shortDescription: city.shortDescription,
      fullDescription: city.fullDescription || city.shortDescription,
      heroImage: city.heroImage || '',
      population: city.population,
      avgHomePrice: city.avgHomePrice,
      tags: city.tags || [],
      neighborhoods: city.neighborhoods || [],
      highlights: city.highlights || [],
      faqs: city.faqs || [],
      clients: city.clients || []
    }))

    // Write to cities.json file
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'cities.json')
    fs.writeFileSync(jsonPath, JSON.stringify(transformedCities, null, 2))
    
    console.log('✅ cities.json updated successfully')
  } catch (error) {
    console.error('❌ Error updating cities.json:', error)
  }
}

// Function to update blogs.json file
export async function updateBlogsJsonFile() {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection('blogs').find({}).toArray()
    
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
    
    // Write language-specific JSON files
    for (const [language, blogs] of Object.entries(blogsByLanguage)) {
      const languageDir = path.join(process.cwd(), 'src', 'data', 'blogs', language)
      ensureDirSync(languageDir)
      
      const jsonPath = path.join(languageDir, 'blogs.json')
      fs.writeFileSync(jsonPath, JSON.stringify(blogs, null, 2))
      console.log(`✅ blogs.json updated for language: ${language} (${blogs.length} published blogs)`)
    }
    
    // Also update the main blogs.json with all published blogs across languages
    const allPublishedBlogs = Object.values(blogsByLanguage).flat()
    const mainJsonPath = path.join(process.cwd(), 'src', 'data', 'blogs.json')
    fs.writeFileSync(mainJsonPath, JSON.stringify(allPublishedBlogs, null, 2))
    console.log(`✅ Main blogs.json updated with ${allPublishedBlogs.length} published blogs across all languages`)
    
  } catch (error) {
    console.error('❌ Error updating blogs.json:', error)
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
    }))
    
    // Write language-specific JSON file
    const languageDir = path.join(process.cwd(), 'src', 'data', 'blogs', language)
    ensureDirSync(languageDir)
    
    const jsonPath = path.join(languageDir, 'blogs.json')
    fs.writeFileSync(jsonPath, JSON.stringify(transformedBlogs, null, 2))
    console.log(`✅ blogs.json updated for language: ${language} (${transformedBlogs.length} published blogs)`)
    
    // Also update the main blogs.json to include this language's blogs
    await updateBlogsJsonFile()
    
  } catch (error) {
    console.error(`❌ Error updating blogs.json for language ${language}:`, error)
  }
}

// Function to create individual blog JSON files for each published blog
export async function createIndividualBlogFiles() {
  try {
    const { db } = await connectToDatabase()
    const blogs = await db.collection('blogs')
      .find({ status: 'Published' })
      .toArray()
    
    for (const blog of blogs) {
      const language = blog.language || 'en'
      const languageDir = path.join(process.cwd(), 'src', 'data', 'blogs', language)
      ensureDirSync(languageDir)
      
      // Create individual blog file
      const blogFilePath = path.join(languageDir, `${blog.slug}.json`)
      const blogData = {
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
      
      fs.writeFileSync(blogFilePath, JSON.stringify(blogData, null, 2))
    }
    
    console.log(`✅ Created individual blog files for ${blogs.length} published blogs`)
    
  } catch (error) {
    console.error('❌ Error creating individual blog files:', error)
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
  }
}

// Function to update home.json file
export async function updateHomeJsonFile(homeData: HomeData) {
  try {
    console.log('🔄 Starting updateHomeJsonFile...')
    
    // Write to home.json file
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'home.json')
    fs.writeFileSync(jsonPath, JSON.stringify(homeData, null, 2))
    
    console.log('✅ home.json updated successfully')
  } catch (error) {
    console.error('❌ Error updating home.json:', error)
  }
}

// Function to update all JSON files
export async function updateAllJsonFiles() {
  await Promise.all([
    updateCitiesJsonFile(),
    updateBlogsJsonFile(),
    updateUsersJsonFile()
  ])
  console.log('✅ All JSON files updated successfully')
}

// Function to update all blog-related JSON files
export async function updateAllBlogJsonFiles() {
  await Promise.all([
    updateBlogsJsonFile(),
    createIndividualBlogFiles()
  ])
  console.log('✅ All blog JSON files updated successfully')
}
