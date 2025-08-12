'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ContactHero from '@/components/sections/Contact/ContactHero'
import ContactForm from '@/components/sections/Contact/ContactForm'
import ContactInfo from '@/components/sections/Contact/ContactInfo'
import SalesModal from '@/components/sections/Contact/SalesModal'
import PrestigeLoading from '@/components/common/PrestigeLoading'
import { ContactData } from '@/types'

const ContactPage = () => {
  const params = useParams()
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [loading, setLoading] = useState(true)
  const locale = (params as Record<string, any>).locale || 'en'

  const fetchContactData = async () => {
    try {
      // Try to fetch from the API first with locale
      const response = await fetch(`/api/contact?locale=${locale}`, {
        cache: 'no-store' // Disable caching
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Contact page received API data:', data)
        setContactData(data)
      } else {
        // Fallback to local JSON file based on locale
        const localResponse = await fetch(`/data/contact/${locale}/contact.json`, {
          cache: 'no-store' // Disable caching
        })
        if (localResponse.ok) {
          const localData = await localResponse.json()
          console.log('✅ Contact page received localized JSON data:', localData)
          setContactData(localData)
        } else {
          // Final fallback to English
          const englishResponse = await fetch('/data/contact/en/contact.json', {
            cache: 'no-store' // Disable caching
          })
          if (englishResponse.ok) {
            const englishData = await englishResponse.json()
            console.log('✅ Contact page received English fallback data:', englishData)
            setContactData(englishData)
          }
        }
      }
    } catch (error) {
      console.error('❌ Error fetching contact data:', error)
      // Fallback to local JSON file based on locale
      try {
        const localResponse = await fetch(`/data/contact/${locale}/contact.json`, {
          cache: 'no-store' // Disable caching
        })
        if (localResponse.ok) {
          const localData = await localResponse.json()
          console.log('✅ Contact page received fallback localized JSON data:', localData)
          setContactData(localData)
        } else {
          // Final fallback to English
          const englishResponse = await fetch('/data/contact/en/contact.json', {
            cache: 'no-store' // Disable caching
          })
          if (englishResponse.ok) {
            const englishData = await englishResponse.json()
            console.log('✅ Contact page received English fallback data:', englishData)
            setContactData(englishData)
          }
        }
      } catch (localError) {
        console.error('❌ Error fetching local contact data:', localError)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContactData()
  }, [locale])

  // Add a refresh function that can be called
  const refreshData = () => {
    setLoading(true)
    fetchContactData()
  }

  // Listen for storage events (when admin updates data)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'contactDataUpdated') {
        console.log('🔄 Contact data updated via storage, refreshing...')
        refreshData()
      }
    }

    // Also listen for custom events (same tab/window updates)
    const handleCustomEvent = () => {
      console.log('🔄 Contact data updated via custom event, refreshing...')
      refreshData()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('contactDataUpdated', handleCustomEvent)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('contactDataUpdated', handleCustomEvent)
    }
  }, [])

  if (loading) {
    return <PrestigeLoading />
  }

  if (!contactData) {
    return (
      <div className="error-container">
        <h2>Error loading contact information</h2>
        <p>Please try refreshing the page.</p>
        <button onClick={refreshData} className="retry-btn">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="contact-page">
      <ContactHero contactData={contactData} />
      <div className="contact-content">
        <div className="contact-container">
          <div className="contact-grid">
            <ContactInfo contactData={contactData} />
            <ContactForm contactData={contactData} />
          </div>
        </div>
      </div>
      <SalesModal />
    </div>
  )
}

export default ContactPage

