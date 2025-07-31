import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <div className="footer-logo">
            <div className="footer-logo-icon">P</div>
            Prestige Estates
          </div>
          <p className="footer-about">With over two decades of experience, Prestige Estates is a leading global real estate consultancy specializing in luxury properties and bespoke relocation services.</p>
          <div className="footer-social">
            <div className="social-icon">f</div>
            <div className="social-icon">in</div>
            <div className="social-icon">ig</div>
            <div className="social-icon">tw</div>
          </div>
        </div>
        <div className="footer-col">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li className="footer-link"><Link href="#services">Services</Link></li>
            <li className="footer-link"><Link href="#blog">Insights</Link></li>
            <li className="footer-link"><Link href="#about">About Us</Link></li>
            <li className="footer-link"><Link href="#contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-heading">Locations</h3>
          <ul className="footer-links">
            <li className="footer-link"><Link href="#">North America</Link></li>
            <li className="footer-link"><Link href="#">Europe</Link></li>
            <li className="footer-link"><Link href="#">Asia</Link></li>
            <li className="footer-link"><Link href="#">Middle East</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-heading">Contact</h3>
          <ul className="footer-links">
            <li className="footer-link"><Link href="tel:+18005551234">+1 (800) 555-1234</Link></li>
            <li className="footer-link"><Link href="mailto:info@prestigeestates.com">info@prestigeestates.com</Link></li>
            <li className="footer-link">123 Luxury Avenue<br />Beverly Hills, CA 90210</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© 2023 Prestige Estates. All rights reserved.</div>
        <div>
          <Link href="#">Privacy Policy</Link> | <Link href="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer