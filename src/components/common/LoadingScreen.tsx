'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import PrestigeLoading from './PrestigeLoading'

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Show loading screen on all page changes
    setIsVisible(true)
    
    // Hide after 2.5 seconds (same as your original timing)
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isVisible) return null

  return <PrestigeLoading />
}

export default LoadingScreen 