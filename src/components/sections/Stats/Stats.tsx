'use client'

import React, { useEffect } from 'react'
import { useTranslations } from 'next-intl'

const Stats = () => {
  const t = useTranslations('stats');
  
  useEffect(() => {
    const animateStats = () => {
      const statNumbers = document.querySelectorAll('.stat-number');
      const speed = 200; // lower = faster
      
      statNumbers.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const count = +stat.innerText;
        const increment = target / speed;
        
        if (count < target) {
          stat.innerText = Math.ceil(count + increment);
          setTimeout(animateStats, 1);
        } else {
          stat.innerText = target;
          // Add plus sign for years experience
          if (stat.getAttribute('data-target') === '25') {
            stat.innerText += '+';
          }
          // Add percent sign for satisfaction
          if (stat.getAttribute('data-target') === '100') {
            stat.innerText += '%';
          }
          // Add B for billion
          if (stat.getAttribute('data-target') === '4.2') {
            stat.innerText += 'B';
          }
          // Add plus for countries
          if (stat.getAttribute('data-target') === '50') {
            stat.innerText += '+';
          }
        }
      });
    }

    // Trigger animation when component mounts
    setTimeout(animateStats, 1000);
  }, []);

  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number" data-target="25">0</div>
          <div className="stat-label">{t('yearsExperience')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-target="4.2">0</div>
          <div className="stat-label">{t('billionInSales')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-target="50">0</div>
          <div className="stat-label">{t('countriesServed')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-target="100">0</div>
          <div className="stat-label">{t('clientSatisfaction')}</div>
        </div>
      </div>
    </section>
  )
}

export default Stats