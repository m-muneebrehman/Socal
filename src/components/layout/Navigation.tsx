'use client'
import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import LanguageSelector from '../common/LanguageSelector';

const Navigation = () => {
  const t = useTranslations('navigation');
  const params = useParams();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navigation ${scrolled ? 'py-3 bg-[rgba(26,26,26,0.98)] backdrop-blur-[15px]' : 'py-5 bg-[rgba(26,26,26,0.95)] backdrop-blur-[10px]'}`}>
      <div className="nav-container">
        <Link href="/" locale={(params as any).locale} className="logo-container">
          <div className="logo-icon">P</div>
          <div className="logo-text">Prestige Estates</div>
        </Link>
        
        <ul className="nav-menu">
          <li><Link href="#cities" className="nav-link">{t('cities')}</Link></li>
          <li><Link href="#services" className="nav-link">{t('services')}</Link></li>
          <li><Link href="#blog" className="nav-link">{t('insights')}</Link></li>
          <li><Link href="#about" className="nav-link">{t('about')}</Link></li>
          <li><Link href="#contact" className="nav-link">{t('contact')}</Link></li>
        </ul>

        <LanguageSelector />
      </div>
    </nav>
  );
};

export default Navigation;