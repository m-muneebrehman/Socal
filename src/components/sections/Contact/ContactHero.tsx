'use client'

import React from 'react'

const ContactHero = () => {
  const openSalesModal = () => {
    // Dispatch custom event to open modal
    document.dispatchEvent(new CustomEvent('openSalesModal'))
  }

  return (
    <section className="contact-profile-hero">
      <div className="contact-container">
        <div className="profile-hero-card">
          <div className="profile-hero-left">
            <div className="profile-image-container">
              <div className="profile-image">
                <div className="profile-placeholder">RB</div>
              </div>
              <div className="profile-status">
                <div className="status-dot"></div>
                <span>Available Now</span>
              </div>
            </div>
            
            <div className="profile-details">
              <h2 className="profile-name">Reza Barghlameno</h2>
              <p className="profile-company">eXp of California</p>
              <p className="profile-title">Lead of Crown Coastal Concierge</p>
              <div className="profile-badges">
                <span className="profile-badge">Top Producer</span>
                <span className="profile-badge">5-Star Rated</span>
              </div>
            </div>
          </div>

          <div className="profile-hero-right">
            <div className="recent-sales-preview">
              <div className="sales-preview-header">
                <h3>Recent Sales</h3>
                <button className="see-all-btn" onClick={openSalesModal}>
                  See All
                </button>
              </div>
              <div className="sales-preview-grid-compact">
                <div className="sale-preview-card-compact">
                  <div className="sale-preview-image-compact">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Property" />
                    <span className="sale-preview-type-compact">Sold</span>
                  </div>
                  <div className="sale-preview-content-compact">
                    <h4>1234 Ocean View Dr, La Jolla</h4>
                    <p className="sale-preview-price">$2,450,000</p>
                    <span className="sale-preview-date">2024</span>
                  </div>
                </div>
                <div className="sale-preview-card-compact">
                  <div className="sale-preview-image-compact">
                    <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Property" />
                    <span className="sale-preview-type-compact">Sold</span>
                  </div>
                  <div className="sale-preview-content-compact">
                    <h4>5678 Coastal Blvd, Del Mar</h4>
                    <p className="sale-preview-price">$1,890,000</p>
                    <span className="sale-preview-date">2024</span>
                  </div>
                </div>
                <div className="sale-preview-card-compact">
                  <div className="sale-preview-image-compact">
                    <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Property" />
                    <span className="sale-preview-type-compact">Sold</span>
                  </div>
                  <div className="sale-preview-content-compact">
                    <h4>9012 Sunset Cliffs Rd, Point Loma</h4>
                    <p className="sale-preview-price">$3,120,000</p>
                    <span className="sale-preview-date">2023</span>
                  </div>
                </div>
                <div className="sale-preview-card-compact">
                  <div className="sale-preview-image-compact">
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Property" />
                    <span className="sale-preview-type-compact">Sold</span>
                  </div>
                  <div className="sale-preview-content-compact">
                    <h4>3456 Pacific Coast Hwy, Encinitas</h4>
                    <p className="sale-preview-price">$2,850,000</p>
                    <span className="sale-preview-date">2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactHero

