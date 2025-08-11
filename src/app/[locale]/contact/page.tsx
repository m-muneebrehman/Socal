'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import ContactHero from '@/components/sections/Contact/ContactHero'
import ContactForm from '@/components/sections/Contact/ContactForm'
import ContactInfo from '@/components/sections/Contact/ContactInfo'
import SalesModal from '@/components/sections/Contact/SalesModal'

const ContactPage = () => {
  const t = useTranslations('contact')

  return (
    <div className="contact-page">
      <ContactHero />
      <div className="contact-content">
        <div className="contact-container">
          <div className="contact-grid">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </div>
      <SalesModal />
    </div>
  )
}

export default ContactPage

