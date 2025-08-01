import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const Footer = () => {
  const t = useTranslations('footer');

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <div className="footer-logo">
            <div className="footer-logo-icon">P</div>
            Prestige Estates
          </div>
          <p className="footer-about">{t('about')}</p>
          <div className="footer-social">
            <div className="social-icon">f</div>
            <div className="social-icon">in</div>
            <div className="social-icon">ig</div>
            <div className="social-icon">tw</div>
          </div>
        </div>
        <div className="footer-col">
          <h3 className="footer-heading">{t('quickLinks')}</h3>
          <ul className="footer-links">
            <li className="footer-link"><Link href="#services">{t('services')}</Link></li>
            <li className="footer-link"><Link href="#blog">{t('insights')}</Link></li>
            <li className="footer-link"><Link href="#about">{t('about')}</Link></li>
            <li className="footer-link"><Link href="#contact">{t('contact')}</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-heading">{t('locations')}</h3>
          <ul className="footer-links">
            <li className="footer-link"><Link href="#">{t('northAmerica')}</Link></li>
            <li className="footer-link"><Link href="#">{t('europe')}</Link></li>
            <li className="footer-link"><Link href="#">{t('asia')}</Link></li>
            <li className="footer-link"><Link href="#">{t('middleEast')}</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-heading">{t('contact')}</h3>
          <ul className="footer-links">
            <li className="footer-link"><Link href="tel:+18005551234">{t('phone')}</Link></li>
            <li className="footer-link"><Link href="mailto:info@prestigeestates.com">{t('email')}</Link></li>
            <li className="footer-link" dangerouslySetInnerHTML={{ __html: t('address') }}></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div>{t('copyright')}</div>
        <div>
          <Link href="#">{t('privacyPolicy')}</Link> | <Link href="#">{t('termsOfService')}</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer