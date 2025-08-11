'use client'
import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import LanguageSelector from '../common/LanguageSelector';

const Navigation = () => {
  const t = useTranslations('navigation');
  const params = useParams();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Prevent scroll restoration to footer on page reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Scroll to top on component mount and prevent footer scroll
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };
    
    // Scroll to top immediately
    scrollToTop();
    
    // Also scroll to top on page visibility change (back/forward navigation)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        scrollToTop();
      }
    };
    
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', scrollToTop);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', scrollToTop);
    };
  }, []);

  const handleSmoothScroll = (targetId: string, event?: React.MouseEvent) => {
    // Prevent default behavior
    if (event) {
      event.preventDefault();
    }
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Use scrollIntoView with better options for mobile
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
    
    // Close mobile menu after clicking a link
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-nav-menu') && !target.closest('.mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={`navigation ${scrolled ? 'py-3 bg-[rgba(26,26,26,0.98)] backdrop-blur-[15px]' : 'py-5 bg-[rgba(26,26,26,0.95)] backdrop-blur-[10px]'}`}>
      <div className="nav-container">
        <Link href="/" locale={(params as any).locale} className="logo-container">
          <div className="logo-icon">P</div>
          <div className="logo-text">Prestige Estates</div>
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="nav-menu">
          <li><button onClick={(e) => handleSmoothScroll('cities', e)} className="nav-link">{t('cities')}</button></li>
          <li><button onClick={(e) => handleSmoothScroll('blog', e)} className="nav-link">{t('insights')}</button></li>
          <li><button onClick={(e) => handleSmoothScroll('services', e)} className="nav-link">{t('services')}</button></li>
          <li><button onClick={(e) => handleSmoothScroll('testimonials', e)} className="nav-link">{t('reviews')}</button></li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <LanguageSelector />
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-menu">
          <ul className="mobile-nav-list">
            <li><button onClick={(e) => handleSmoothScroll('cities', e)} className="mobile-nav-link">{t('cities')}</button></li>
            <li><button onClick={(e) => handleSmoothScroll('blog', e)} className="mobile-nav-link">{t('insights')}</button></li>
            <li><button onClick={(e) => handleSmoothScroll('services', e)} className="mobile-nav-link">{t('services')}</button></li>
            <li><button onClick={(e) => handleSmoothScroll('testimonials', e)} className="mobile-nav-link">{t('reviews')}</button></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;