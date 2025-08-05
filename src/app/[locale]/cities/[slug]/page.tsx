'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import citiesData from '@/data/cities.json'
import { notFound } from 'next/navigation'

interface CityPageProps {
  params: {
    slug: string
  }
}

const CityPage = ({ params }: CityPageProps) => {
  const t = useTranslations('cities')
  const city = citiesData.find(c => c.slug === params.slug)
  const [activeTab, setActiveTab] = useState('all')

  if (!city) {
    notFound()
  }

  const categories = ['all', ...new Set(city.faqs.map(faq => faq.category))]
  const filteredFaqs = activeTab === 'all' ? city.faqs : city.faqs.filter(faq => faq.category === activeTab)

  return (
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
                  <span className="stat-label">residents</span>
                </div>
                <div className="stat-divider"></div>
                <div className="quick-stat">
                  <span className="stat-number">{city.avgHomePrice}</span>
                  <span className="stat-label">avg price</span>
                </div>
              </div>
            </div>

            {/* Main Title Section */}
            <div className="hero-title-section">
              <div className="hero-eyebrow">
                <span className="eyebrow-text">Premium Destination</span>
                <div className="eyebrow-line"></div>
              </div>
              
              <h1 className="hero-main-title">
                <span className="title-line-1">Discover the Magic of</span>
                <span className="title-line-2">{city.name}</span>
              </h1>
              
              <p className="hero-description">{city.shortDescription}</p>
            </div>

            {/* Interactive Buttons */}
            <div className="hero-actions">
              <button className="hero-btn-primary">
                <div className="btn-content">
                  <span className="btn-text">Explore Properties</span>
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
                  <span className="btn-text">Contact Agent</span>
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
              <div className="stat-icon">👥</div>
              <div className="stat-number">{city.population}</div>
              <div className="stat-label">Population</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏠</div>
              <div className="stat-number">{city.avgHomePrice}</div>
              <div className="stat-label">Avg Home Price</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏘️</div>
              <div className="stat-number">{city.neighborhoods.length}</div>
              <div className="stat-label">Neighborhoods</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">{city.highlights.length}</div>
              <div className="stat-label">Key Features</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="city-about-section">
        <div className="city-about-container">
          <div className="about-content">
            <span className="section-eyebrow">About</span>
            <h2 className="section-title-large">Why Choose {city.name}?</h2>
            <p className="about-description">{city.fullDescription}</p>
            <div className="city-tags-enhanced">
              {city.tags.map((tag, index) => (
                <span key={index} className="city-tag-enhanced">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced City Highlights */}
      <section className="city-highlights-enhanced">
        <div className="highlights-container">
          <div className="section-header-center">
            <span className="section-eyebrow">Highlights</span>
            <h2 className="section-title-large">What Makes {city.name} Special</h2>
          </div>
          <div className="highlights-grid">
            {city.highlights.map((highlight, index) => (
              <div key={index} className="highlight-card-enhanced">
                <div className="highlight-bg" style={{ backgroundImage: `url('${highlight.bgImage}')` }}>
                  <div className="highlight-overlay">
                    <div className="highlight-content">
                      <div className="highlight-icon-large">{highlight.icon}</div>
                      <h3 className="highlight-title">{highlight.title}</h3>
                      <p className="highlight-description">{highlight.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced FAQs Section */}
      <section className="city-faqs-enhanced">
        <div className="faqs-container">
          <div className="section-header-center">
            <span className="section-eyebrow">FAQ</span>
            <h2 className="section-title-large">Everything You Need to Know</h2>
          </div>
          
          {/* FAQ Categories */}
          <div className="faq-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={`faq-category-btn ${activeTab === category ? 'active' : ''}`}
                onClick={() => setActiveTab(category)}
              >
                {category === 'all' ? 'All Questions' : category}
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

      {/* Enhanced Clients Section */}
      <section className="city-clients-enhanced">
        <div className="clients-container">
          <div className="section-header-center">
            <span className="section-eyebrow">Testimonials</span>
            <h2 className="section-title-large">What Our Clients Say</h2>
          </div>
          <div className="clients-grid">
            {city.clients.map((client, index) => (
              <div key={index} className="client-card-enhanced">
                <div className="client-rating">
                  {[...Array(client.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <blockquote className="client-review">"{client.review}"</blockquote>
                <div className="client-info">
                  <img src={client.image} alt={client.name} className="client-avatar" />
                  <div className="client-details">
                    <h4 className="client-name">{client.name}</h4>
                    <p className="client-title">{client.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Back Section */}
      <section className="city-back-enhanced">
        <div className="back-container">
          <Link href="/" className="back-btn-enhanced">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Explore All Cities</span>
          </Link>
        </div>
      </section>
    </main>
  )
}

export default CityPage