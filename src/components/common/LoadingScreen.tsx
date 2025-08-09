'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Show loading screen on all pages
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isVisible) return null

  return (
    <div className="loading-screen">
      <div className="loading-logo">PRESTIGE ESTATES</div>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  )
}

export default LoadingScreen 