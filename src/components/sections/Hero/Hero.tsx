import React from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface HeroProps {
  heroData?: {
    badge: string
    title: string
    subtitle: string
    viewProperties: string
    contactUs: string
    scrollDown: string
    backgroundImage?: string
  }
}

const Hero = ({ heroData }: HeroProps) => {
  const t = useTranslations('hero');
  
  const scrollToStats = () => {
    const statsSection = document.querySelector('.stats-section');
    statsSection?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Use API data if available, otherwise fall back to translations
  const badge = heroData?.badge || t('badge')
  const title = heroData?.title || t('title')
  const subtitle = heroData?.subtitle || t('subtitle')
  const viewProperties = heroData?.viewProperties || t('viewProperties')
  const contactUs = heroData?.contactUs || t('contactUs')
  const scrollDown = heroData?.scrollDown || t('scrollDown')
  const backgroundImage = heroData?.backgroundImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'

  return (
    <section 
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.7)), url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="hero-content">
        <div className="hero-badge">{badge}</div>
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        <div className="hero-cta">
          <button className="btn-primary">{viewProperties}</button>
          <Link href="/contact" className="btn-secondary">
            {contactUs}
          </Link>
        </div>
      </div>
      <button className="swipe-down-btn" onClick={scrollToStats}>
        <div className="swipe-arrow"></div>
        <div className="swipe-text">{scrollDown}</div>
      </button>
    </section>
  )
}

export default Hero