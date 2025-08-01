import React from 'react'
import { useTranslations } from 'next-intl'

const Hero = () => {
  const t = useTranslations('hero');
  
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
        <div className="hero-badge">{t('badge')}</div>
        <h1 className="hero-title">{t('title')}</h1>
        <p className="hero-subtitle">{t('subtitle')}</p>
        <div className="hero-cta">
          <button className="btn-primary">{t('viewProperties')}</button>
          <button className="btn-secondary">{t('contactUs')}</button>
        </div>
      </div>
      <button className="swipe-down-btn" onClick={scrollToStats}>
        <div className="swipe-arrow"></div>
        <div className="swipe-text">{t('scrollDown')}</div>
      </button>
    </section>
  )
}

export default Hero