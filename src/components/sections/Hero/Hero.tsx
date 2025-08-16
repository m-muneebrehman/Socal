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
  currentLocale?: string
}

const Hero = ({ heroData, currentLocale = 'en' }: HeroProps) => {
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
  const backgroundImage = heroData?.backgroundImage || '/home/hero.jpg'

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
        <h1 className="hero-title" lang={currentLocale}>{title}</h1>
        <p className="hero-subtitle" lang={currentLocale}>{subtitle}</p>
        <div className="hero-cta">
          <Link href="/cities" className="btn-primary">
            {viewProperties}
          </Link>
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