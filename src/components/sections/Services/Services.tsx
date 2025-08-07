import React from 'react'
import { useTranslations } from 'next-intl'

interface ServicesProps {
  servicesData?: {
    title: string
    subtitle: string
    propertyAcquisition: {
      title: string
      description: string
      icon: string
    }
    investmentAdvisory: {
      title: string
      description: string
      icon: string
    }
    relocationServices: {
      title: string
      description: string
      icon: string
    }
  }
}

const Services = ({ servicesData }: ServicesProps) => {
  const t = useTranslations('services');

  // Use API data if available, otherwise fall back to translations
  const title = servicesData?.title || t('title')
  const subtitle = servicesData?.subtitle || t('subtitle')
  const propertyAcquisition = servicesData?.propertyAcquisition || {
    title: t('propertyAcquisition.title'),
    description: t('propertyAcquisition.description'),
    icon: '🏡'
  }
  const investmentAdvisory = servicesData?.investmentAdvisory || {
    title: t('investmentAdvisory.title'),
    description: t('investmentAdvisory.description'),
    icon: '💰'
  }
  const relocationServices = servicesData?.relocationServices || {
    title: t('relocationServices.title'),
    description: t('relocationServices.description'),
    icon: '🌎'
  }

  return (
    <section className="services-section" id="services">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      <div className="services-grid">
        <div className="service-card">
          <div className="service-premium-leaves">
            <div className="service-leaf-top-right"></div>
          </div>
          <div className="service-icon">{propertyAcquisition.icon}</div>
          <h3 className="service-title">{propertyAcquisition.title}</h3>
          <p className="service-description">{propertyAcquisition.description}</p>
        </div>
        <div className="service-card">
          <div className="service-premium-leaves">
            <div className="service-leaf-top-right"></div>
          </div>
          <div className="service-icon">{investmentAdvisory.icon}</div>
          <h3 className="service-title">{investmentAdvisory.title}</h3>
          <p className="service-description">{investmentAdvisory.description}</p>
        </div>
        <div className="service-card">
          <div className="service-premium-leaves">
            <div className="service-leaf-top-right"></div>
          </div>
          <div className="service-icon">{relocationServices.icon}</div>
          <h3 className="service-title">{relocationServices.title}</h3>
          <p className="service-description">{relocationServices.description}</p>
        </div>
      </div>
    </section>
  )
}

export default Services