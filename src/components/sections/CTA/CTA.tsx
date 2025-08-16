import React from 'react'
import { useTranslations } from 'next-intl'
import ConsultationForm from '@/components/common/ConsultationForm'

interface CTAProps {
  ctaData?: {
    title: string
    text: string
    button: string
  }
}

const CTA = ({ ctaData }: CTAProps) => {
  const t = useTranslations('cta');

  // Use API data if available, otherwise fall back to translations
  const title = ctaData?.title || t('title')
  const text = ctaData?.text || t('text')
  const button = ctaData?.button || t('button')

  return (
    <ConsultationForm
      title={title}
      text={text}
      button={button}
      showCitySpecific={false}
    />
  )
}

export default CTA