import React from 'react'
import { useTranslations } from 'next-intl'

const Services = () => {
  const t = useTranslations('services');

  return (
    <section className="services-section" id="services">
      <div className="section-header">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>
      </div>
      <div className="services-grid">
        <div className="service-card">
          <div className="service-premium-leaves">
            <div className="service-leaf-top-right"></div>
          </div>
          <div className="service-icon">🏡</div>
          <h3 className="service-title">{t('propertyAcquisition.title')}</h3>
          <p className="service-description">{t('propertyAcquisition.description')}</p>
        </div>
        <div className="service-card">
          <div className="service-premium-leaves">
            <div className="service-leaf-top-right"></div>
          </div>
          <div className="service-icon">💰</div>
          <h3 className="service-title">{t('investmentAdvisory.title')}</h3>
          <p className="service-description">{t('investmentAdvisory.description')}</p>
        </div>
        <div className="service-card">
          <div className="service-premium-leaves">
            <div className="service-leaf-top-right"></div>
          </div>
          <div className="service-icon">🌎</div>
          <h3 className="service-title">{t('relocationServices.title')}</h3>
          <p className="service-description">{t('relocationServices.description')}</p>
        </div>
      </div>
    </section>
  )
}

export default Services