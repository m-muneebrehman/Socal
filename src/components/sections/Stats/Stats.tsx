'use client'

import React, { useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface StatsProps {
  statsData?: {
    yearsExperience: string
    yearsExperienceLabel: string
    billionInSales: string
    billionInSalesLabel: string
    countriesServed: string
    countriesServedLabel: string
    clientSatisfaction: string
    clientSatisfactionLabel: string
  }
}

const Stats = ({ statsData }: StatsProps) => {
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

  // Use API data if available, otherwise fall back to translations
  const yearsExperience = statsData?.yearsExperience || "25+"
  const yearsExperienceLabel = statsData?.yearsExperienceLabel || t('yearsExperience')
  const billionInSales = statsData?.billionInSales || "4.2B"
  const billionInSalesLabel = statsData?.billionInSalesLabel || t('billionInSales')
  const countriesServed = statsData?.countriesServed || "50+"
  const countriesServedLabel = statsData?.countriesServedLabel || t('countriesServed')
  const clientSatisfaction = statsData?.clientSatisfaction || "100%"
  const clientSatisfactionLabel = statsData?.clientSatisfactionLabel || t('clientSatisfaction')

  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number" data-target={yearsExperience.replace(/[^0-9.]/g, '')}>0</div>
          <div className="stat-label">{yearsExperienceLabel}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-target={billionInSales.replace(/[^0-9.]/g, '')}>0</div>
          <div className="stat-label">{billionInSalesLabel}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-target={countriesServed.replace(/[^0-9.]/g, '')}>0</div>
          <div className="stat-label">{countriesServedLabel}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" data-target={clientSatisfaction.replace(/[^0-9.]/g, '')}>0</div>
          <div className="stat-label">{clientSatisfactionLabel}</div>
        </div>
      </div>
    </section>
  )
}

export default Stats