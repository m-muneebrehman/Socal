'use client'
import React, { useEffect, useState } from 'react'
import Hero from '@/components/sections/Hero/Hero'
import Stats from '@/components/sections/Stats/Stats'
import Cities from '@/components/sections/Cities/Cities'
import Blog from '@/components/sections/Blog/Blog'
import Services from '@/components/sections/Services/Services'
import CTA from '@/components/sections/CTA/CTA'
import { HomeData } from '@/types'

const Home = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchHomeData = async () => {
    try {
      console.log('🔄 Home page fetching data...')
      // First try to fetch from API
      const response = await fetch('/api/home', {
        cache: 'no-store' // Disable caching
      })
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Home page received data:', data)
        setHomeData(data)
      } else {
        console.log('⚠️ API failed, trying JSON file...')
        // Fallback to local JSON file
        const localResponse = await fetch('/data/home.json', {
          cache: 'no-store' // Disable caching
        })
        if (localResponse.ok) {
          const localData = await localResponse.json()
          console.log('✅ Home page received JSON data:', localData)
          setHomeData(localData)
        }
      }
    } catch (error) {
      console.error('❌ Error fetching home data:', error)
      // Fallback to local JSON file
      try {
        const localResponse = await fetch('/data/home.json', {
          cache: 'no-store' // Disable caching
        })
        if (localResponse.ok) {
          const localData = await localResponse.json()
          console.log('✅ Home page received fallback JSON data:', localData)
          setHomeData(localData)
        }
      } catch (localError) {
        console.error('❌ Error fetching local home data:', localError)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHomeData()
  }, [])

  // Add a refresh function that can be called
  const refreshData = () => {
    setLoading(true)
    fetchHomeData()
  }

  // Listen for storage events (when admin updates data)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'homeDataUpdated') {
        console.log('🔄 Home data updated via storage, refreshing...')
        refreshData()
      }
    }

    const handleCustomEvent = () => {
      console.log('🔄 Home data updated via custom event, refreshing...')
      refreshData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('homeDataUpdated', handleCustomEvent)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('homeDataUpdated', handleCustomEvent)
    }
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </main>
    )
  }

  if (!homeData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Page</h1>
          <p>Unable to load home page data. Please try refreshing the page.</p>
          <button 
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-gold text-white rounded hover:bg-gold-dark"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main>
      <Hero heroData={homeData.hero} />
      <Stats statsData={homeData.stats} />
      <Cities citiesData={homeData.cities} />
      <Blog blogData={homeData.blog} />
      <Services servicesData={homeData.services} />
      <CTA ctaData={homeData.cta} />
    </main>
  )
}

export default Home