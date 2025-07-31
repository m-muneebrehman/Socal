'use client'
import React from 'react'
import Hero from '@/components/sections/Hero/Hero'
import Stats from '@/components/sections/Stats/Stats'
import Blog from '@/components/sections/Blog/Blog'
import Services from '@/components/sections/Services/Services'
import CTA from '@/components/sections/CTA/CTA'

const Home = () => {
  return (
    <main>
      <Hero />
      <Stats />
      <Blog />
      <Services />
      <CTA />
    </main>
  )
}

export default Home