'use client'
import React, { useEffect, useState } from 'react'

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

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