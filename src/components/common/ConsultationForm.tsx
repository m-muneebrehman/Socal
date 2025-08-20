import React, { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'

interface ConsultationFormProps {
  title?: string
  text?: string
  button?: string
  cityName?: string
  showCitySpecific?: boolean
  // Translation props
  rezaBarghlameno?: string
  primeLocalHomes?: string
  readyToBuyOrSell?: string
  name?: string
  enterYourName?: string
  phone?: string
  enterYourPhone?: string
  email?: string
  enterYourEmail?: string
  message?: string
  enterYourMessage?: string
  sendMessage?: string
  back?: string
  sending?: string
}

const ConsultationForm = ({ 
  title = "Ready to Find Your Dream Property?", 
  text = "Contact our expert team today for a personalized consultation and start your journey to finding the perfect home or investment property.",
  button = "Schedule Consultation",
  cityName,
  showCitySpecific = false,
  // Translation props
  rezaBarghlameno,
  primeLocalHomes,
  readyToBuyOrSell,
  name,
  enterYourName,
  phone,
  enterYourPhone,
  email,
  enterYourEmail,
  message,
  enterYourMessage,
  sendMessage,
  back,
  sending
}: ConsultationFormProps) => {
  const [showConsultation, setShowConsultation] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    salutation: '',   // <-- NEW field
    name: '',
    phone: '',
    email: '',
    purpose: '',      // <-- NEW field
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

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      // EmailJS template parameters
      const templateParams = {
        to_name: 'Crown Coastal Concierge',
        from_salutation: contactFormData.salutation, // <-- NEW
        from_name: contactFormData.name,
        from_email: contactFormData.email,
        from_phone: contactFormData.phone,
        purpose: contactFormData.purpose,            // <-- NEW
        message: contactFormData.message,
        reply_to: contactFormData.email,
        city: cityName || 'Southern California'
      }

      if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) {
        throw new Error('EmailJS configuration not found in environment variables')
      }

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams
      )

      if (result.status === 200) {
        setSubmitStatus('success')
        setStatusMessage('Message sent successfully! We\'ll get back to you soon.')
        
        setContactFormData({
          salutation: '',
          name: '',
          phone: '',
          email: '',
          purpose: '',
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

  return (
    <div className={`consultation-section-wrapper ${showConsultation ? 'flipped' : ''}`}>
      {/* Front Side */}
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
      
      {/* Back Side */}
      <section className="consultation-section-back">
        <div className="consultation-back-content">
          <div className="consultation-grid">
            {/* Agent Info */}
            <div className="agent-info-section">
              <div className="agent-info">
                <h3 className="agent-name">
                  {rezaBarghlameno || "Reza Barghlameno"}
                </h3>
                <li className="footer-link">CA DRE # 02211952</li> {/* DRE number */}
                <p className="company-name">{primeLocalHomes || "Prime Local Homes"}</p>
                <div className="contact-details">
                  <div className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>+1 858-305-4362</span>
                  </div>
                  <div className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>reza@primelocalhomes.com</span>
                  </div>
                  {/* Address */}
                  <div className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>702 Broadway, San Diego, CA, 92101</span>
                  </div>
                </div>
                <p className="consultation-cta-text">
                  {showCitySpecific && cityName 
                    ? readyToBuyOrSell?.replace('{countyName}', cityName) || `Ready to buy or sell in ${cityName}? Contact Reza Barghlameno today for expert guidance and express service when you need it most.`
                    : readyToBuyOrSell?.replace('{countyName}', 'Southern California') || "Ready to buy or sell in Southern California? Contact Reza Barghlameno today for expert guidance and express service when you need it most."
                  }
                </p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="right-content-section">
              <div className="contact-form-container">
                <form className="contact-form-simple" onSubmit={handleContactSubmit}>
                  
                  {/* Row - Salutation */}
                  <div className="form-row">
                    <div className="form-field full-width">
                      <label htmlFor="salutation" className="form-label">Title</label>
                      <select
                        id="salutation"
                        name="salutation"
                        className="form-input-field"
                        value={contactFormData.salutation}
                        onChange={handleContactFormChange}
                      >
                        <option value="">Select...</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                      </select>
                    </div>
                  </div>

                  {/* Row - Name and Phone */}
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="name" className="form-label">{name || "Name"}</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input-field"
                        placeholder={enterYourName || "Enter your name"}
                        value={contactFormData.name}
                        onChange={handleContactFormChange}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="phone" className="form-label">{phone || "Phone"}</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-input-field"
                        placeholder={enterYourPhone || "Enter your phone"}
                        value={contactFormData.phone}
                        onChange={handleContactFormChange}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Row - Email */}
                  <div className="form-row">
                    <div className="form-field full-width">
                      <label htmlFor="email" className="form-label">{email || "Email"}</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input-field"
                        placeholder={enterYourEmail || "Enter your email"}
                        value={contactFormData.email}
                        onChange={handleContactFormChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Row - Purpose */}
                  <div className="form-row">
                    <div className="form-field full-width">
                      <label htmlFor="purpose" className="form-label">Purpose</label>
                      <select
                        id="purpose"
                        name="purpose"
                        className="form-input-field"
                        value={contactFormData.purpose}
                        onChange={handleContactFormChange}
                      >
                        <option value="">Select...</option>
                        <option value="Buying">Buying</option>
                        <option value="Selling">Selling</option>
                        <option value="Renting">Renting</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Row - Message */}
                  <div className="form-row">
                    <div className="form-field full-width">
                      <label htmlFor="message" className="form-label">{message || "Message"}</label>
                      <textarea
                        id="message"
                        name="message"
                        className="form-textarea-field"
                        placeholder={enterYourMessage || "Enter your message"}
                        rows={4}
                        value={contactFormData.message}
                        onChange={handleContactFormChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Submit */}
                  <div className="form-row">
                    <div className="form-field full-width">
                      <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? (sending || 'Sending...') : (sendMessage || 'Send Message')}
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
          </div>
          
          <button 
            className="consultation-back-btn"
            onClick={() => setShowConsultation(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {back || "Back"}
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConsultationForm
