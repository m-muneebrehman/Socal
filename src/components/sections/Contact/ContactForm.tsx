'use client'

import React, { useState } from 'react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Form submitted:', formData)
    setIsSubmitting(false)
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: ''
    })
  }

  return (
    <div className="contact-form-section">
      <div className="form-header">
        <div className="form-badge">Ready to Connect</div>
        <h2 className="form-title">Contact Crown Coastal Concierge</h2>
        <p className="form-subtitle">
          Ready to start your real estate journey? Get in touch today and let's discuss your dream property in San Diego.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <span className="label-text">Full Name</span>
              <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <div className="input-icon">👤</div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              <span className="label-text">Phone Number</span>
              <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <div className="input-icon">📞</div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <span className="label-text">Email Address</span>
              <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <div className="input-icon">✉️</div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="message" className="form-label">
              <span className="label-text">Message</span>
              <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <div className="input-icon">💬</div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Tell us about your real estate needs, preferred locations, budget, and any specific requirements..."
                rows={5}
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form-consent">
          <div className="consent-header">
            <div className="consent-icon">🔒</div>
            <h4>Privacy & Consent</h4>
          </div>
          <p className="consent-text">
            By submitting your information, you agree that the real estate professional identified above may call/text you about your search, which may involve use of automated means and pre-recorded/artificial voices. You don't need to consent as a condition of buying any property, goods, or services. Message/data rates may apply. You also agree to our Terms of Use.
          </p>
        </div>

        <button 
          type="submit" 
          className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          <span className="btn-text">
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </span>
          <div className="btn-icon">
            {isSubmitting ? (
              <div className="loading-spinner"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            )}
          </div>
        </button>

        <div className="form-footer">
          <div className="response-time">
            <div className="response-icon">⚡</div>
            <span>We typically respond within 2 hours during business hours</span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ContactForm

