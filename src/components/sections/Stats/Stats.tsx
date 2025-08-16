'use client'

import React from 'react'
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
          <div className="stat-number">{yearsExperience}</div>
          <div className="stat-label">{yearsExperienceLabel}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{billionInSales}</div>
          <div className="stat-label">{billionInSalesLabel}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{countriesServed}</div>
          <div className="stat-label">{countriesServedLabel}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{clientSatisfaction}</div>
          <div className="stat-label">{clientSatisfactionLabel}</div>
        </div>
      </div>
    </section>
  )
}

export default Stats