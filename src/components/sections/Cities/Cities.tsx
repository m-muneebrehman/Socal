'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import citiesData from '@/data/cities.json'

const Cities = () => {
  const t = useTranslations('cities');
  
  // Show only first 3 cities
  const displayedCities = citiesData.slice(0, 3);

  return (
    <section className="cities-section-beautiful" id="cities">
      <div className="cities-container-beautiful">
        <div className="section-header-beautiful">
          <span className="section-eyebrow-beautiful">Destinations</span>
          <h2 className="section-title-beautiful">{t('title') || 'Discover Your Perfect City'}</h2>
          <p className="section-subtitle-beautiful">{t('subtitle') || 'Explore premium locations across California\'s most desirable cities'}</p>
        </div>
        
        <div className="cities-grid-beautiful">
          {displayedCities.map((city, index) => (
            <Link 
              key={city.slug} 
              href={`/cities/${city.slug}`}
              className="city-card-beautiful"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="city-card-inner-beautiful">
                <div className="city-image-beautiful" style={{ backgroundImage: `url('${city.heroImage}')` }}>
                  <div className="city-gradient-overlay-beautiful"></div>
                  <div className="city-badges-beautiful">
                    <span className="city-state-badge-beautiful">{city.state}</span>
                    <span className="city-price-badge-beautiful">{city.avgHomePrice}</span>
                  </div>
                </div>
                
                <div className="city-content-beautiful">
                  <div className="city-header-beautiful">
                    <h3 className="city-name-beautiful">{city.name}</h3>
                    <div className="city-neighborhoods-count-beautiful">
                      {city.neighborhoods?.length || 0} neighborhoods
                    </div>
                  </div>
                  
                  <p className="city-description-beautiful">{city.shortDescription}</p>
                  
                  <div className="city-tags-row-beautiful">
                    {city.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="city-tag-beautiful">{tag}</span>
                    ))}
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
        
        <div className="cities-section-footer-beautiful">
          <Link href="/cities" className="see-more-btn-beautiful">
            <span>See All Cities</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Cities