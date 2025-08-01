'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
]

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (languageCode: string) => {
    // Get current pathname
    const currentPath = window.location.pathname
    
    // Remove current locale from pathname
    let pathWithoutLocale = currentPath
    for (const lang of languages) {
      if (currentPath.startsWith(`/${lang.code}/`)) {
        pathWithoutLocale = currentPath.replace(`/${lang.code}`, '')
        break
      } else if (currentPath === `/${lang.code}`) {
        pathWithoutLocale = '/'
        break
      }
    }
    
    // Ensure pathWithoutLocale starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale
    }
    
    // Navigate to new locale
    const newPath = `/${languageCode}${pathWithoutLocale}`
    window.location.href = newPath
    setIsOpen(false)
  }

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button 
        className="language-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-code">{currentLanguage.code.toUpperCase()}</span>
        <span className="language-arrow">▼</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown-menu">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${language.code === locale ? 'active' : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="language-flag">{language.flag}</span>
              <span className="language-name">{language.name}</span>
              {language.code === locale && <span className="language-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector 