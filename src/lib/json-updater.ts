import fs from 'fs'
import path from 'path'
import { connectToDatabase } from './mongodb'

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
    
    // Transform the data to match the expected format
    const transformedBlogs = blogs.map(blog => ({
      id: blog._id.toString(),
      slug: blog.slug,
      title: blog.title,
      subtitle: blog.subtitle || '',
      category: blog.category,
      author: blog.author,
      date: blog.date,
      status: blog.status,
      featured: blog.featured || false,
      content: blog.content || { lead: '' },
      views: blog.views || 0,
      likes: blog.likes || 0
    }))

    // Write to blogs.json file
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'blogs.json')
    fs.writeFileSync(jsonPath, JSON.stringify(transformedBlogs, null, 2))
    
    console.log('✅ blogs.json updated successfully')
  } catch (error) {
    console.error('❌ Error updating blogs.json:', error)
  }
}

// Function to update users.json file
export async function updateUsersJsonFile() {
  try {
    const { db } = await connectToDatabase()
    const users = await db.collection('users').find({}).toArray()
    
    // Transform the data to match the expected format
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'User',
      status: user.status || 'Active',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))

    // Write to users.json file
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'users.json')
    fs.writeFileSync(jsonPath, JSON.stringify(transformedUsers, null, 2))
    
    console.log('✅ users.json updated successfully')
  } catch (error) {
    console.error('❌ Error updating users.json:', error)
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
