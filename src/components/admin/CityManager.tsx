"use client"

import { Plus, Edit2, Trash2, Users, Home, MapPin } from "lucide-react"
import { City as CityType } from "@/types"

interface CityManagerProps {
  cities: CityType[]
  setShowCityModal: (show: boolean) => void
  setEditingCity: (id: string | null) => void
  setCityForm: (form: any) => void
  deleteCity: (id: string) => void
  handleAddCity: () => void
}

export default function CityManager({ 
  cities, 
  setShowCityModal, 
  setEditingCity, 
  setCityForm, 
  deleteCity,
  handleAddCity
}: CityManagerProps) {
  return (
    <div className="content-section">
      <div className="section-header">
        <div className="section-info">
          <div className="count-badge green">
            <span>Total Cities: </span>
            <span>{cities.length}</span>
          </div>
        </div>
        <button onClick={handleAddCity} className="add-btn green">
          <Plus size={20} />
          <span>Add City</span>
        </button>
      </div>

      <div className="content-grid two-cols">
        {cities.map((city) => (
          <div key={city._id || city.id || Math.random()} className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">{city.name}, {city.state}</h3>
                <p className="card-subtitle">{city.shortDescription}</p>
              </div>
              <div className="card-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => {
                    const cityId = city._id || city.id || ''
                    setEditingCity(cityId)
                    setCityForm({
                      _id: cityId,
                      slug: city.slug,
                      name: city.name,
                      state: city.state,
                      population: city.population,
                      avgHomePrice: city.avgHomePrice,
                      heroImage: city.heroImage || '',
                      heroImageAlt: city.heroImageAlt || '',
                      shortDescription: city.shortDescription,
                      fullDescription: city.fullDescription || '',
                      canonicalUrl: city.canonicalUrl || '',
                      tags: city.tags?.join(', ') || '',
                      neighborhoods: city.neighborhoods?.length > 0 ? city.neighborhoods : [''],
                      highlights: city.highlights?.length > 0 ? city.highlights : [{ 
                        title: '', 
                        description: '', 
                        icon: '', 
                        bgImage: '',
                        bgImageAlt: ''
                      }],
                      faqs: city.faqs?.length > 0 ? city.faqs : [{ 
                        question: '', 
                        answer: '', 
                        category: 'Neighborhoods' 
                      }],
                      clients: city.clients && city.clients.length > 0 ? city.clients : [{ 
                        name: '', 
                        description: '', 
                        image: '', 
                        imageAlt: '',
                        rating: 5, 
                        review: '' 
                      }],
                      hreflang_tags: city.hreflang_tags?.length > 0 ? city.hreflang_tags : [{ 
                        hreflang: 'en', 
                        href: '' 
                      }],
                      seo: city.seo || {
                        metaTitle: '',
                        metaDescription: '',
                        keywords: '',
                        ogTitle: '',
                        ogDescription: '',
                        ogImage: '',
                        ogImageAlt: '',
                        twitterCard: 'summary_large_image'
                      },
                      schema_markup: city.schema_markup?.length > 0 ? city.schema_markup : [],
                      internal_links: city.internal_links?.length > 0 ? city.internal_links : [{ 
                        href: '', 
                        anchor: '', 
                        context: '' 
                      }]
                    })
                    setShowCityModal(true)
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button className="action-btn delete" onClick={() => {
                  console.log('City object for deletion:', city)
                  const cityId = city._id || city.id || ''
                  console.log('Extracted city ID:', cityId)
                  if (cityId) {
                    deleteCity(cityId)
                  } else {
                    alert('Cannot delete city: No valid ID found')
                  }
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="city-stats">
              <div className="city-stat blue">
                <Users className="city-stat-icon blue" size={20} />
                <p>{city.population}</p>
                <p>Population</p>
              </div>
              <div className="city-stat green">
                <Home className="city-stat-icon green" size={20} />
                <p>{city.avgHomePrice}</p>
                <p>Avg Price</p>
              </div>
              <div className="city-stat purple">
                <MapPin className="city-stat-icon purple" size={20} />
                <p>{city.neighborhoods?.length || 0}</p>
                <p>Areas</p>
              </div>
            </div>

            <div className="tags">
              {city.tags?.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
              {city.tags?.length > 3 && (
                <span className="tag gray">+{city.tags.length - 3} more</span>
              )}
            </div>

            <div className="card-meta">
              <span>Slug: {city.slug}</span>
              <span>{city.highlights?.length || 0} highlights</span>
              <span>{city.faqs?.length || 0} FAQs</span>
            </div>
          </div>
        ))}
        {cities.length === 0 && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">No cities found</h3>
                <p className="card-subtitle">Create your first city to get started</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
