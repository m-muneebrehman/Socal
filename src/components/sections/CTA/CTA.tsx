import React from 'react'
import { useTranslations } from 'next-intl'

interface CTAProps {
  ctaData?: {
    title: string
    text: string
    button: string
  }
}

const CTA = ({ ctaData }: CTAProps) => {
  const t = useTranslations('cta');

  // Use API data if available, otherwise fall back to translations
  const title = ctaData?.title || t('title')
  const text = ctaData?.text || t('text')
  const button = ctaData?.button || t('button')

  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">{title}</h2>
        <p className="cta-text">{text}</p>
        <button className="cta-btn">{button}</button>
      </div>
    </section>
  )
}

export default CTA