"use client"

import { useState } from "react"
import { Edit2, Save, X } from "lucide-react"
import { HomeData } from "@/types"

interface HomeManagerProps {
  homeData: HomeData
  updateHomeData: (data: HomeData) => void
}

export default function HomeManager({ 
  homeData, 
  updateHomeData
}: HomeManagerProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<HomeData>(homeData)

  const handleEdit = (section: string) => {
    setEditingSection(section)
    setEditData(homeData)
  }

  const handleSave = () => {
    updateHomeData(editData)
    setEditingSection(null)
  }

  const handleCancel = () => {
    setEditingSection(null)
    setEditData(homeData)
  }

  return (
    <div className="admin-home-content">
      <div className="section-header" style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '24px 32px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, rgba(241, 245, 249, 0) 50%, rgba(212, 175, 55, 0.03) 100%)',
          zIndex: 1
        }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '28px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>Home Page Content</h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>Manage and customize your home page content</p>
        </div>
      </div>

      <div className="content-grid">
        {/* Hero Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Hero Section</h3>
              <p className="card-subtitle">Main landing section</p>
            </div>
            <div className="card-actions">
              {editingSection === 'hero' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('hero')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'hero' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Badge</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hero.badge}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, badge: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hero.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, title: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <textarea
                  className="form-textarea"
                  value={editData.hero.subtitle}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">View Properties Button</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hero.viewProperties}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, viewProperties: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Us Button</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hero.contactUs}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, contactUs: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Scroll Down Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hero.scrollDown}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, scrollDown: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Background Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter image URL or upload image"
                  value={editData.hero.backgroundImage || ''}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, backgroundImage: e.target.value }
                  }))}
                />
                <small className="form-help">Enter a valid image URL or leave empty for default</small>
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="hero-preview" style={{
                position: 'relative',
                height: '300px',
                backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.7)), url('${homeData.hero.backgroundImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: '8px',
                padding: '40px',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ maxWidth: '600px' }}>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid #d4af37',
                    padding: '8px 20px',
                    borderRadius: '25px',
                    fontSize: '10px',
                    fontWeight: '500',
                    color: '#d4af37',
                    letterSpacing: '1px',
                    marginBottom: '20px',
                    textTransform: 'uppercase'
                  }}>{homeData.hero.badge}</div>
                  
                  <h4 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '28px',
                    fontWeight: '500',
                    lineHeight: '1.1',
                    marginBottom: '15px',
                    maxWidth: '400px'
                  }}>{homeData.hero.title}</h4>
                  
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: '300',
                    marginBottom: '25px',
                    maxWidth: '500px',
                    opacity: '0.9',
                    lineHeight: '1.5'
                  }}>{homeData.hero.subtitle}</p>
                  
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <button style={{
                      background: '#d4af37',
                      color: '#1a1a1a',
                      padding: '12px 25px',
                      border: 'none',
                      borderRadius: '2px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>{homeData.hero.viewProperties}</button>
                    
                    <button style={{
                      background: 'transparent',
                      color: 'white',
                      padding: '12px 25px',
                      border: '1px solid white',
                      borderRadius: '2px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>{homeData.hero.contactUs}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Stats Section</h3>
              <p className="card-subtitle">Statistics and numbers</p>
            </div>
            <div className="card-actions">
              {editingSection === 'stats' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('stats')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'stats' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Years Experience Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.yearsExperience}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, yearsExperience: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Years Experience Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.yearsExperienceLabel}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, yearsExperienceLabel: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Billion in Sales Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.billionInSales}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, billionInSales: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Billion in Sales Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.billionInSalesLabel}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, billionInSalesLabel: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Countries Served Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.countriesServed}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, countriesServed: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Countries Served Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.countriesServedLabel}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, countriesServedLabel: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Satisfaction Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.clientSatisfaction}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, clientSatisfaction: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Satisfaction Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.stats.clientSatisfactionLabel}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    stats: { ...prev.stats, clientSatisfactionLabel: e.target.value }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="stats-preview">
                <div className="stat-item">
                  <span className="stat-number">{homeData.stats.yearsExperience}</span>
                  <span className="stat-label">{homeData.stats.yearsExperienceLabel}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{homeData.stats.billionInSales}</span>
                  <span className="stat-label">{homeData.stats.billionInSalesLabel}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{homeData.stats.countriesServed}</span>
                  <span className="stat-label">{homeData.stats.countriesServedLabel}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{homeData.stats.clientSatisfaction}</span>
                  <span className="stat-label">{homeData.stats.clientSatisfactionLabel}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cities Section Blueprint */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Cities Section</h3>
              <p className="card-subtitle">Cities showcase</p>
            </div>
            <div className="card-actions">
              {editingSection === 'cities' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('cities')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'cities' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.cities?.title || 'Explore California Cities'}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    cities: { 
                      title: e.target.value,
                      subtitle: prev.cities?.subtitle || 'Discover the most desirable locations across the Golden State, each offering unique lifestyle opportunities and investment potential.'
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Subtitle</label>
                <textarea
                  className="form-textarea"
                  value={editData.cities?.subtitle || 'Discover the most desirable locations across the Golden State, each offering unique lifestyle opportunities and investment potential.'}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    cities: { 
                      title: prev.cities?.title || 'Explore California Cities',
                      subtitle: e.target.value
                    }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="section-header" style={{
                textAlign: 'center',
                marginBottom: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h2 className="section-title" style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '36px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0',
                  letterSpacing: '0.5px',
                  textAlign: 'center'
                }}>
                  {editData.cities?.title || 'Explore California Cities'}
                </h2>
                <p className="section-subtitle" style={{
                  fontSize: '18px',
                  color: 'rgba(26, 26, 26, 0.7)',
                  margin: '0',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  textAlign: 'center'
                }}>
                  {editData.cities?.subtitle || 'Discover the most desirable locations across the Golden State, each offering unique lifestyle opportunities and investment potential.'}
                </p>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                {/* City Card Blueprints */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏙️</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>City Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from cities.json</div>
                </div>
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌆</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>City Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from cities.json</div>
                </div>
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏘️</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>City Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from cities.json</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Blog Section Blueprint */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Blog Section</h3>
              <p className="card-subtitle">Latest articles</p>
            </div>
            <div className="card-actions">
              {editingSection === 'blog' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('blog')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'blog' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.blog?.title || 'Latest Insights'}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    blog: { 
                      title: e.target.value,
                      subtitle: prev.blog?.subtitle || 'Discover our expert perspectives on luxury real estate markets worldwide.'
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Subtitle</label>
                <textarea
                  className="form-textarea"
                  value={editData.blog?.subtitle || 'Discover our expert perspectives on luxury real estate markets worldwide.'}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    blog: { 
                      title: prev.blog?.title || 'Latest Insights',
                      subtitle: e.target.value
                    }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="section-header" style={{
                textAlign: 'center',
                marginBottom: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h2 className="section-title" style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '36px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0',
                  letterSpacing: '0.5px',
                  textAlign: 'center'
                }}>
                  {editData.blog?.title || 'Latest Insights'}
                </h2>
                <p className="section-subtitle" style={{
                  fontSize: '18px',
                  color: 'rgba(26, 26, 26, 0.7)',
                  margin: '0',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  textAlign: 'center'
                }}>
                  {editData.blog?.subtitle || 'Discover our expert perspectives on luxury real estate markets worldwide.'}
                </p>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                {/* Blog Card Blueprints */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📰</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>Blog Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from blogs.json</div>
                </div>
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>Blog Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from blogs.json</div>
                </div>
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px dashed #dee2e6',
                  textAlign: 'center',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📊</div>
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>Blog Card</div>
                  <div style={{ fontSize: '14px' }}>Dynamic content from blogs.json</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Services Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Services Section</h3>
              <p className="card-subtitle">Service offerings</p>
            </div>
            <div className="card-actions">
              {editingSection === 'services' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('services')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'services' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { ...prev.services, title: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Subtitle</label>
                <textarea
                  className="form-textarea"
                  value={editData.services.subtitle}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { ...prev.services, subtitle: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Property Acquisition Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.propertyAcquisition.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      propertyAcquisition: { 
                        ...prev.services.propertyAcquisition, 
                        title: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Property Acquisition Description</label>
                <textarea
                  className="form-textarea"
                  value={editData.services.propertyAcquisition.description}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      propertyAcquisition: { 
                        ...prev.services.propertyAcquisition, 
                        description: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Property Acquisition Icon</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.propertyAcquisition.icon}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      propertyAcquisition: { 
                        ...prev.services.propertyAcquisition, 
                        icon: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Investment Advisory Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.investmentAdvisory.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      investmentAdvisory: { 
                        ...prev.services.investmentAdvisory, 
                        title: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Investment Advisory Description</label>
                <textarea
                  className="form-textarea"
                  value={editData.services.investmentAdvisory.description}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      investmentAdvisory: { 
                        ...prev.services.investmentAdvisory, 
                        description: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Investment Advisory Icon</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.investmentAdvisory.icon}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      investmentAdvisory: { 
                        ...prev.services.investmentAdvisory, 
                        icon: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relocation Services Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.relocationServices.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      relocationServices: { 
                        ...prev.services.relocationServices, 
                        title: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relocation Services Description</label>
                <textarea
                  className="form-textarea"
                  value={editData.services.relocationServices.description}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      relocationServices: { 
                        ...prev.services.relocationServices, 
                        description: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relocation Services Icon</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.services.relocationServices.icon}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    services: { 
                      ...prev.services, 
                      relocationServices: { 
                        ...prev.services.relocationServices, 
                        icon: e.target.value 
                      } 
                    }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="section-header" style={{
                textAlign: 'center',
                marginBottom: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h2 className="section-title" style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '36px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 16px 0',
                  letterSpacing: '0.5px',
                  textAlign: 'center'
                }}>
                  {homeData.services.title}
                </h2>
                <p className="section-subtitle" style={{
                  fontSize: '18px',
                  color: 'rgba(26, 26, 26, 0.7)',
                  margin: '0',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  textAlign: 'center'
                }}>
                  {homeData.services.subtitle}
                </p>
              </div>
              <div className="services-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                <div className="service-card" style={{
                  padding: '50px 35px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.1)'
                }}>
                  <div className="service-premium-leaves" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'hidden'
                  }}>
                    <div className="service-leaf-top-right" style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '200px',
                      height: '140px',
                      background: 'url("/golden-leaves.png") no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      transformOrigin: '100% 0%',
                      transform: 'scale(0) rotate(-45deg)',
                      opacity: '0',
                      transition: 'all 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      zIndex: '2'
                    }}></div>
                  </div>
                  <div className="service-icon" style={{
                    fontSize: '48px',
                    marginBottom: '25px',
                    color: '#d4af37',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.propertyAcquisition.icon}
                  </div>
                  <h3 className="service-title" style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '24px',
                    marginBottom: '18px',
                    color: '#1a1a1a',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.propertyAcquisition.title}
                  </h3>
                  <p className="service-description" style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: 'rgba(26, 26, 26, 0.7)',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.propertyAcquisition.description}
                  </p>
                </div>

                <div className="service-card" style={{
                  padding: '50px 35px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.1)'
                }}>
                  <div className="service-premium-leaves" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'hidden'
                  }}>
                    <div className="service-leaf-top-right" style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '200px',
                      height: '140px',
                      background: 'url("/golden-leaves.png") no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      transformOrigin: '100% 0%',
                      transform: 'scale(0) rotate(-45deg)',
                      opacity: '0',
                      transition: 'all 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      zIndex: '2'
                    }}></div>
                  </div>
                  <div className="service-icon" style={{
                    fontSize: '48px',
                    marginBottom: '25px',
                    color: '#d4af37',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.investmentAdvisory.icon}
                  </div>
                  <h3 className="service-title" style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '24px',
                    marginBottom: '18px',
                    color: '#1a1a1a',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.investmentAdvisory.title}
                  </h3>
                  <p className="service-description" style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: 'rgba(26, 26, 26, 0.7)',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.investmentAdvisory.description}
                  </p>
                </div>

                <div className="service-card" style={{
                  padding: '50px 35px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.1)'
                }}>
                  <div className="service-premium-leaves" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'hidden'
                  }}>
                    <div className="service-leaf-top-right" style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      width: '200px',
                      height: '140px',
                      background: 'url("/golden-leaves.png") no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      transformOrigin: '100% 0%',
                      transform: 'scale(0) rotate(-45deg)',
                      opacity: '0',
                      transition: 'all 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      zIndex: '2'
                    }}></div>
                  </div>
                  <div className="service-icon" style={{
                    fontSize: '48px',
                    marginBottom: '25px',
                    color: '#d4af37',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.relocationServices.icon}
                  </div>
                  <h3 className="service-title" style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '24px',
                    marginBottom: '18px',
                    color: '#1a1a1a',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.relocationServices.title}
                  </h3>
                  <p className="service-description" style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: 'rgba(26, 26, 26, 0.7)',
                    transition: 'all 0.4s ease'
                  }}>
                    {homeData.services.relocationServices.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="card home-section-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">CTA Section</h3>
              <p className="card-subtitle">Call to action</p>
            </div>
            <div className="card-actions">
              {editingSection === 'cta' ? (
                <>
                  <button className="action-btn save" onClick={handleSave}>
                    <Save size={16} />
                  </button>
                  <button className="action-btn cancel" onClick={handleCancel}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button className="action-btn edit" onClick={() => handleEdit('cta')}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          </div>

          {editingSection === 'cta' ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.cta.title}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    cta: { ...prev.cta, title: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Text</label>
                <textarea
                  className="form-textarea"
                  value={editData.cta.text}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    cta: { ...prev.cta, text: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.cta.button}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    cta: { ...prev.cta, button: e.target.value }
                  }))}
                />
              </div>
            </div>
          ) : (
            <div className="section-preview">
              <div className="cta-preview" style={{
                background: '#1a1a1a',
                color: 'white',
                padding: '40px',
                borderRadius: '8px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(26, 26, 26, 0) 50%, rgba(212, 175, 55, 0.05) 100%)',
                  zIndex: 1
                }}></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h4 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '24px',
                    fontWeight: '500',
                    marginBottom: '15px',
                    color: 'white'
                  }}>{homeData.cta.title}</h4>
                  <p style={{
                    fontSize: '14px',
                    marginBottom: '25px',
                    opacity: '0.8',
                    lineHeight: '1.6',
                    color: 'white'
                  }}>{homeData.cta.text}</p>
                  <button style={{
                    background: 'transparent',
                    color: 'white',
                    padding: '12px 25px',
                    border: '2px solid #d4af37',
                    borderRadius: '4px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease'
                  }}>{homeData.cta.button}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
