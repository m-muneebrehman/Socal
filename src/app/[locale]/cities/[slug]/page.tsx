// Keep as client for UI, but move SEO to server via generateMetadata in adjacent file
'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import PrestigeLoading from '@/components/common/PrestigeLoading'

// using useParams in client to avoid accessing Promise-based params prop

interface CityData {
  slug: string
  name: string
  state: string
  shortDescription: string
  fullDescription: string
  heroImage: string
  heroImageAlt?: string
  population: string
  avgHomePrice: string
  tags: string[]
  neighborhoods: Array<{
    name: string
    type: string
    slug: string
    description: string
    image: string
    imageAlt?: string
    distance: string
    avgHomePrice: string
    county: string
  }>
  highlights: Array<{
    title: string
    description: string
    icon: string
    bgImage: string
    bgImageAlt?: string
  }>
  faqs: Array<{
    question: string
    answer: string
    category: string
  }>
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogImageAlt?: string
    twitterCard?: string
  }
  schema_markup?: any[]
}

const CityPage = () => {
  const t = useTranslations('cities')
  const params = useParams()
  const locale = (params as any)?.locale
  const slug = (params as any)?.slug
  const [city, setCity] = useState<CityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        // Try to fetch from the new multi-language structure
        const response = await fetch(`/api/cities/${locale}/${slug}`)
        
        if (response.ok) {
          const cityData = await response.json()
          setCity(cityData)
        } else {
          // Fallback to English if the locale doesn't exist
          const fallbackResponse = await fetch(`/api/cities/en/${slug}`)
          if (fallbackResponse.ok) {
            const cityData = await fallbackResponse.json()
            setCity(cityData)
          } else {
            notFound()
          }
        }
      } catch (error) {
        console.error('Error fetching city data:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchCityData()
  }, [slug, locale])

  if (loading) {
    return <PrestigeLoading />
  }

  if (!city) {
    notFound()
  }

  const categories = ['all', ...new Set(city.faqs.map(faq => faq.category))]
  const filteredFaqs = activeTab === 'all' ? city.faqs : city.faqs.filter(faq => faq.category === activeTab)

  // SEO Meta Tags - with fallbacks for missing data
  const seoData = {
    title: city.seo?.metaTitle || `${city.name} Real Estate & Lifestyle Guide - Luxury Living in ${city.name}`,
    description: city.seo?.metaDescription || `Explore luxury real estate, top neighborhoods, and cultural highlights in ${city.name}. Discover why ${city.name} is a top destination for living, investing, and lifestyle.`,
    keywords: city.seo?.keywords || `${city.name} real estate, ${city.name} lifestyle, luxury homes, neighborhoods, cultural attractions`,
    ogTitle: city.seo?.ogTitle || `Discover ${city.name}: Luxury Real Estate & Lifestyle Guide`,
    ogDescription: city.seo?.ogDescription || `Explore diverse neighborhoods, real estate insights, and highlights of ${city.name}. Find your dream home in the heart of ${city.state}.`,
    ogImage: city.seo?.ogImage || city.heroImage,
    ogImageAlt: city.seo?.ogImageAlt || `${city.name} city skyline`,
    canonicalUrl: `https://example.com/locations/${city.slug}`,
    structuredData: city.schema_markup || [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": city.name,
        "description": `Explore real estate, neighborhoods, and highlights in ${city.name}, ${city.state}.`,
        "url": `https://example.com/locations/${city.slug}`,
        "image": {
          "@type": "ImageObject",
          "url": city.heroImage,
          "caption": `${city.name} city skyline`
        },
        "inLanguage": locale,
        "mainEntity": {
          "@type": "City",
          "name": city.name,
          "address": {
            "@type": "PostalAddress",
            "addressRegion": city.state,
            "addressCountry": "USA"
          }
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": city.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  }

  return (
    <>
      <main className="city-page">
        {/* Ultra Modern Hero Section */}
        <section className="city-hero-ultra">
          {/* Dynamic Background with Parallax */}
          <div className="hero-background-container">
            <div className="hero-bg-primary" style={{ backgroundImage: `url('${city.heroImage}')` }}>
              <div className="hero-bg-overlay"></div>
            </div>
            <div className="hero-bg-secondary"></div>
            <div className="hero-bg-pattern"></div>
            
            {/* Animated Floating Elements */}
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
              <div className="shape shape-4"></div>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="hero-content-wrapper">
            <div className="hero-content-container">
              {/* Top Badge Section */}
              <div className="hero-top-section">
                <div className="hero-location-badge">
                  <div className="location-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span className="location-text">{city.state}</span>
                </div>
                
                <div className="hero-quick-stats">
                  <div className="quick-stat">
                    <span className="stat-number">{city.population}</span>
                    <span className="stat-label">{t('cityPage.residents')}</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="quick-stat">
                    <span className="stat-number">{city.avgHomePrice}</span>
                    <span className="stat-label">{t('cityPage.avgPrice')}</span>
                  </div>
                </div>
              </div>

              {/* Main Title Section */}
              <div className="hero-title-section">
                <div className="hero-eyebrow">
                  <span className="eyebrow-text">{t('cityPage.premiumDestination')}</span>
                  <div className="eyebrow-line"></div>
                </div>
                
                <h1 className="hero-main-title">
                  <span className="title-line-1">{t('cityPage.discoverMagicOf')}</span>
                  <span className="title-line-2">{city.name}</span>
                </h1>
                
                <p className="hero-description">{city.shortDescription}</p>
              </div>

              {/* Interactive Buttons */}
              <div className="hero-actions">
                <button className="hero-btn-primary">
                  <div className="btn-content">
                    <span className="btn-text">{t('cityPage.exploreProperties')}</span>
                    <div className="btn-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div className="btn-glow"></div>
                </button>
                
                <button className="hero-btn-secondary">
                  <div className="btn-content">
                    <span className="btn-text">{t('cityPage.contactAgent')}</span>
                    <div className="btn-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2H2L10 12.46V19L14 17V12.46L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced City Stats */}
        <section className="city-stats-enhanced">
          <div className="city-stats-container">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M23 21V19C23 18.1137 22.6488 17.2528 22.0168 16.5959C21.3848 15.9389 20.5147 15.5294 19.6 15.44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0148 6.11883 19.0148 7.005C19.0148 7.89117 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-number">{city.population}</div>
                <div className="stat-label">{t('cityPage.population')}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-number">{city.avgHomePrice}</div>
                <div className="stat-label">{t('cityPage.avgHomePrice')}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-number">{city.neighborhoods.length}</div>
                <div className="stat-label">{t('cityPage.neighborhoods')}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-number">{city.highlights.length}</div>
                <div className="stat-label">{t('cityPage.highlights')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* City About Section */}
        <section className="city-about-section">
          <div className="city-about-container">
            <h2 className="section-title-large">{t('cityPage.about')} {city.name}</h2>
            <p className="about-description">{city.fullDescription}</p>
            
            <div className="city-tags-enhanced">
              {city.tags.map((tag, index) => (
                <span key={index} className="city-tag-enhanced">{tag}</span>
              ))}
            </div>
          </div>
        </section>

        {/* City Highlights Section */}
        <section className="city-highlights-enhanced">
          <div className="highlights-container">
            <div className="section-header-center">
              <span className="section-eyebrow">{t('cityPage.highlights')}</span>
              <h2 className="section-title-large">{t('cityPage.whatMakesSpecial', { cityName: city.name })}</h2>
            </div>
            
            <div className="highlights-grid">
              {city.highlights && city.highlights.length > 0 ? (
                city.highlights.map((highlight, index) => (
                  <div key={index} className="highlight-card-enhanced">
                    <div className="highlight-bg" style={{ backgroundImage: `url('${highlight.bgImage}')` }}>
                      <div className="highlight-overlay">
                        <div className="highlight-content">
                          <div className="highlight-icon-large">
                            <span className="highlight-icon-text">{highlight.icon}</span>
                          </div>
                          <h3 className="highlight-title">{highlight.title}</h3>
                          <p className="highlight-description">{highlight.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
                  <p>{t('cityPage.noHighlightsAvailable', { cityName: city.name })}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Beautiful Neighborhood Cities Section */}
        <section className="cities-section-beautiful" id="neighborhoods">
          <div className="cities-container-beautiful">
            <div className="section-header-beautiful">
              <span className="section-eyebrow-beautiful">{t('cityPage.nearbyCities')}</span>
              <h2 className="section-title-beautiful">{t('cityPage.exploreSurroundingAreas')}</h2>
              <p className="section-subtitle-beautiful">{t('cityPage.discoverDiverseNeighborhoods', { cityName: city.name })}</p>
            </div>
            
            <div className="cities-grid-beautiful">
              {city.neighborhoods.map((neighborhood, index) => (
                <Link 
                  key={neighborhood.slug} 
                  href={`/cities/${neighborhood.slug}`}
                  locale={locale}
                  className="city-card-beautiful"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="city-card-inner-beautiful">
                    <div className="city-image-beautiful" style={{ backgroundImage: `url('${neighborhood.image}')` }}>
                      <div className="city-gradient-overlay-beautiful"></div>
                      <div className="city-badges-beautiful">
                        <span className="city-state-badge-beautiful">{neighborhood.county} {t('cityPage.county')}</span>
                        <span className="city-price-badge-beautiful">{neighborhood.avgHomePrice}</span>
                      </div>
                    </div>
                    
                    <div className="city-content-beautiful">
                      <div className="city-header-beautiful">
                        <h3 className="city-name-beautiful">{neighborhood.name}</h3>
                        <div className="city-neighborhoods-count-beautiful">
                          {neighborhood.type}
                        </div>
                      </div>
                      
                      <p className="city-description-beautiful">{neighborhood.description}</p>
                      
                      <div className="city-tags-row-beautiful">
                        <span className="city-tag-beautiful">{neighborhood.county} {t('cityPage.county')}</span>
                        <span className="city-tag-beautiful">{neighborhood.distance}</span>
                      </div>
                      
                      <div className="city-card-footer-beautiful">
                        <div className="explore-arrow-beautiful">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced FAQs Section */}
        <section className="city-faqs-enhanced">
          <div className="faqs-container">
            <div className="section-header-center">
              <span className="section-eyebrow">{t('cityPage.faq')}</span>
              <h2 className="section-title-large">{t('cityPage.everythingYouNeedToKnow')}</h2>
            </div>
            
            {/* FAQ Categories */}
            <div className="faq-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`faq-category-btn ${activeTab === category ? 'active' : ''}`}
                  onClick={() => setActiveTab(category)}
                >
                  {category === 'all' ? t('cityPage.allQuestions') : category}
                </button>
              ))}
            </div>

            {/* FAQ Grid */}
            <div className="faqs-grid">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="faq-card-enhanced">
                  <div className="faq-category-tag">{faq.category}</div>
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Back to Cities Link */}
        <section className="city-back-enhanced">
          <div className="back-container">
            <Link href="/cities" locale={locale} className="back-btn-enhanced">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{t('cityPage.exploreAllCities')}</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

export default CityPage