'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navigation = () => {
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
        <div className="logo-container">
          <div className="logo-icon">P</div>
          <div className="logo-text">Prestige Estates</div>
        </div>
        
        <ul className="nav-menu">
          <li><Link href="#services" className="nav-link">Services</Link></li>
          <li><Link href="#blog" className="nav-link">Insights</Link></li>
          <li><Link href="#about" className="nav-link">About</Link></li>
          <li><Link href="#contact" className="nav-link">Contact</Link></li>
        </ul>

        <div className="language-dropdown">
          <button className="language-btn">EN</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;