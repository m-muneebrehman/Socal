'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Hero from '@/components/sections/Hero/Hero'
import Stats from '@/components/sections/Stats/Stats'
import Cities from '@/components/sections/Cities/Cities'
import Blog from '@/components/sections/Blog/Blog'
import Services from '@/components/sections/Services/Services'
import CTA from '@/components/sections/CTA/CTA'
import Testimonials from '@/components/sections/Testimonials/Testimonials'
import PrestigeLoading from '@/components/common/PrestigeLoading'

const Home = () => {
  const params = useParams()
  const [homeData, setHomeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const locale = (params as any).locale || 'en'

  const fetchHomeData = async () => {
    try {
      // Try to fetch from the API first with locale
      const response = await fetch(`/api/home?locale=${locale}`, {
        cache: 'no-store' // Disable caching
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Home page received API data:', data)
        setHomeData(data)
      } else {
        // Fallback to local JSON file based on locale
        const localResponse = await fetch(`/data/home/${locale}/home.json`, {
          cache: 'no-store' // Disable caching
        })
        if (localResponse.ok) {
          const localData = await localResponse.json()
          console.log('✅ Home page received localized JSON data:', localData)
          setHomeData(localData)
        } else {
          // Final fallback to English
          const englishResponse = await fetch('/data/home/en/home.json', {
            cache: 'no-store' // Disable caching
          })
          if (englishResponse.ok) {
            const englishData = await englishResponse.json()
            console.log('✅ Home page received English fallback data:', englishData)
            setHomeData(englishData)
          }
        }
      }
    } catch (error) {
      console.error('❌ Error fetching home data:', error)
      // Fallback to local JSON file based on locale
      try {
        const localResponse = await fetch(`/data/home/${locale}/home.json`, {
          cache: 'no-store' // Disable caching
        })
        if (localResponse.ok) {
          const localData = await localResponse.json()
          console.log('✅ Home page received fallback localized JSON data:', localData)
          setHomeData(localData)
        } else {
          // Final fallback to English
          const englishResponse = await fetch('/data/home/en/home.json', {
            cache: 'no-store' // Disable caching
          })
          if (englishResponse.ok) {
            const englishData = await englishResponse.json()
            console.log('✅ Home page received English fallback data:', englishData)
            setHomeData(englishData)
          }
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
  }, [locale])

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
    return <PrestigeLoading />
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
      <Cities citiesData={homeData.cities} locale={locale} />
      <Blog blogData={homeData.blog} />
      <Services servicesData={homeData.services} />
      <Testimonials 
        title={homeData.testimonials?.title}
        subtitle={homeData.testimonials?.subtitle}
        items={homeData.testimonials?.items}
      />
      <CTA ctaData={homeData.cta} />
    </main>
  )
}

export default Home