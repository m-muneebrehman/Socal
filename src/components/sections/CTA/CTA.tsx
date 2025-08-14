import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import emailjs from '@emailjs/browser'

interface CTAProps {
  ctaData?: {
    title: string
    text: string
    button: string
  }
}

const CTA = ({ ctaData }: CTAProps) => {
  const t = useTranslations('cta');
  const [showConsultation, setShowConsultation] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  // Initialize EmailJS
  useEffect(() => {
    try {
      if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)
        console.log('EmailJS initialized successfully')
      } else {
        console.error('EmailJS public key not found in environment variables')
      }
    } catch (error) {
      console.error('EmailJS initialization failed:', error)
    }
  }, [])

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!contactFormData.name.trim() || !contactFormData.email.trim()) {
      setSubmitStatus('error')
      setStatusMessage('Please fill in both name and email fields.')
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setStatusMessage('')
    
    try {
      // EmailJS template parameters - using standard EmailJS variables
      const templateParams = {
        to_name: 'Crown Coastal Concierge',
        from_name: contactFormData.name,
        from_email: contactFormData.email,
        from_phone: contactFormData.phone,
        message: contactFormData.message,
        reply_to: contactFormData.email
      }

      // Check if all required environment variables are set
      if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) {
        throw new Error('EmailJS configuration not found in environment variables')
      }

      // Send email using EmailJS with environment variables
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams
      )

      if (result.status === 200) {
        setSubmitStatus('success')
        setStatusMessage('Message sent successfully! We\'ll get back to you soon.')
        
        // Reset form
        setContactFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error: any) {
      console.error('Email sending failed:', error)
      setSubmitStatus('error')
      setStatusMessage(`Failed to send message: ${error?.message || 'Unknown error'}. Please try again or contact us directly.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetStatus = () => {
    setSubmitStatus('idle')
    setStatusMessage('')
  }

  // Use API data if available, otherwise fall back to translations
  const title = ctaData?.title || t('title')
  const text = ctaData?.text || t('text')
  const button = ctaData?.button || t('button')

  return (
    <div className={`consultation-section-wrapper ${showConsultation ? 'flipped' : ''}`}>
      {/* Front Side - Schedule Consultation */}
      <section className="consultation-section-front">
        <div className="cta-container">
          <h2 className="cta-title">{title}</h2>
          <p className="cta-text">{text}</p>
          <button 
            className="cta-btn"
            onClick={() => setShowConsultation(true)}
          >
            {button}
          </button>
        </div>
      </section>
      
      {/* Back Side - Contact Form and Agent Info */}
      <section className="consultation-section-back">
        <div className="consultation-back-content">
          <div className="consultation-grid">
            {/* Left Side - Agent Information */}
            <div className="agent-info-section">
              <div className="agent-info">
                <h3 className="agent-name">Reza Barghlameno</h3>
                <p className="company-name">Prime Local Homes</p>
                <div className="contact-details">
                  <div className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>+1-XXX-XXX-XXXX</span>
                  </div>
                  <div className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>reza@primelocalhomes.com</span>
                  </div>
                </div>
                <p className="consultation-cta-text">Ready to buy or sell in Southern California? Contact Reza Barghlameno today for expert guidance and express service when you need it most.</p>
              </div>
            </div>
            
            {/* Right Side - Contact Form */}
            <div className="contact-form-section">
              <form className="contact-form-simple" onSubmit={handleContactSubmit}>
                {/* First Row - Name and Phone */}
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-input-field"
                      placeholder="Enter your name"
                      value={contactFormData.name}
                      onChange={handleContactFormChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-input-field"
                      placeholder="Enter your phone"
                      value={contactFormData.phone}
                      onChange={handleContactFormChange}
                      required
                    />
                  </div>
                </div>
                
                {/* Second Row - Email */}
                <div className="form-row">
                  <div className="form-field full-width">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-input-field"
                      placeholder="Enter your email"
                      value={contactFormData.email}
                      onChange={handleContactFormChange}
                      required
                    />
                  </div>
                </div>
                
                {/* Third Row - Message */}
                <div className="form-row">
                  <div className="form-field full-width">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea-field"
                      placeholder="Enter your message"
                      rows={4}
                      value={contactFormData.message}
                      onChange={handleContactFormChange}
                      required
                    ></textarea>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="form-row">
                  <div className="form-field full-width">
                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                    {submitStatus === 'success' && (
                      <p className="form-status-message success">{statusMessage}</p>
                    )}
                    {submitStatus === 'error' && (
                      <p className="form-status-message error">{statusMessage}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <button 
            className="consultation-back-btn"
            onClick={() => setShowConsultation(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        </div>
      </section>
    </div>
  )
}

export default CTA