import React from 'react'

const Services = () => {
  return (
    <section className="services-section" id="services">
      <div className="section-header">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">Comprehensive real estate solutions tailored to your unique needs.</p>
      </div>
      <div className="services-grid">
        <div className="service-card">
          <div className="service-premium-leaves">
            <div className="service-leaf-top-right"></div>
          </div>
          <div className="service-icon">🏡</div>
          <h3 className="service-title">Property Acquisition</h3>
          <p className="service-description">Our global network and market expertise ensures you find the perfect property that meets all your requirements.</p>
        </div>
        <div className="service-card">
          <div className="service-premium-leaves">
            <div className="service-leaf-top-right"></div>
          </div>
          <div className="service-icon">💰</div>
          <h3 className="service-title">Investment Advisory</h3>
          <p className="service-description">Strategic guidance to maximize returns on your real estate investments with our data-driven approach.</p>
        </div>
        <div className="service-card">
          <div className="service-premium-leaves">
            <div className="service-leaf-top-right"></div>
          </div>
          <div className="service-icon">🌎</div>
          <h3 className="service-title">Relocation Services</h3>
          <p className="service-description">Comprehensive support for international clients moving to new countries, including legal and logistical assistance.</p>
        </div>
      </div>
    </section>
  )
}

export default Services