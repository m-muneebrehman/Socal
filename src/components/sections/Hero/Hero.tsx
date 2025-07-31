import React from 'react'

const Hero = () => {
  const scrollToStats = () => {
    const statsSection = document.querySelector('.stats-section');
    statsSection?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">Global Luxury Real Estate</div>
        <h1 className="hero-title">Exclusive Properties for Discerning Clients</h1>
        <p className="hero-subtitle">With over 20 years of experience, we connect international buyers with the finest properties across the world's most desirable locations.</p>
        <div className="hero-cta">
          <button className="btn-primary">View Properties</button>
          <button className="btn-secondary">Contact Us</button>
        </div>
      </div>
      <button className="swipe-down-btn" onClick={scrollToStats}>
        <div className="swipe-arrow"></div>
        <div className="swipe-text">Scroll Down</div>
      </button>
    </section>
  )
}

export default Hero