import React from 'react'
import { useTranslations } from 'next-intl'

const CTA = () => {
  const t = useTranslations('cta');

  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2 className="cta-title">{t('title')}</h2>
        <p className="cta-text">{t('text')}</p>
        <button className="cta-btn">{t('button')}</button>
      </div>
    </section>
  )
}

export default CTA