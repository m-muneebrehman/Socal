'use client'

import React, { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import citiesData from '@/data/cities.json'
import CitySearch from '@/components/sections/Cities/CitySearch'
import CityGrid from '@/components/sections/Cities/CityGrid'
import Pagination from '@/components/sections/Cities/Pagination'

const CitiesPage = () => {
  const t = useTranslations('cities')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const citiesPerPage = 9

  // Filter cities based on search term
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return citiesData
    
    return citiesData.filter(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      city.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredCities.length / citiesPerPage)
  const startIndex = (currentPage - 1) * citiesPerPage
  const endIndex = startIndex + citiesPerPage
  const currentCities = filteredCities.slice(startIndex, endIndex)

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <main className="cities-page">
      {/* Page Header */}
      <section className="cities-page-header">
        <div className="cities-page-container">
          <div className="page-header-content">
            <span className="page-eyebrow">All Cities</span>
            <h1 className="page-title">Discover California's Finest Cities</h1>
            <p className="page-subtitle">
              Explore our curated selection of premium destinations across the Golden State
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="cities-search-section">
        <div className="cities-page-container">
          <CitySearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalCities={filteredCities.length}
          />
        </div>
      </section>

      {/* Cities Grid Section */}
      <section className="cities-grid-section">
        <div className="cities-page-container">
          {filteredCities.length > 0 ? (
            <>
              <CityGrid cities={currentCities} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-section">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3 className="no-results-title">No cities found</h3>
              <p className="no-results-text">
                Try adjusting your search terms or browse all cities below
              </p>
              <button 
                className="reset-search-btn"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default CitiesPage 