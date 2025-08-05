'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import blogsData from '@/data/blogs.json'
import HeroBlogCard from '@/components/sections/Blog/HeroBlogCard'
import BlogGridCard from '@/components/sections/Blog/BlogGridCard'

const BlogPage = () => {
  const t = useTranslations('blog')
  const [currentPage, setCurrentPage] = useState(1)
  const blogsPerPage = 8
  const featuredBlog = blogsData.find(blog => blog.featured)
  const regularBlogs = blogsData.filter(blog => !blog.featured)

  // Calculate pagination
  const totalPages = Math.ceil(regularBlogs.length / blogsPerPage)
  const startIndex = (currentPage - 1) * blogsPerPage
  const endIndex = startIndex + blogsPerPage
  const currentBlogs = regularBlogs.slice(startIndex, endIndex)

  // Sticky navigation effect
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('.navigation')
      if (nav) {
        if (window.scrollY > 50) {
          nav.style.padding = '15px 0'
          nav.style.background = 'rgba(26, 26, 26, 0.98)'
          nav.style.backdropFilter = 'blur(15px)'
        } else {
          nav.style.padding = '20px 0'
          nav.style.background = 'rgba(26, 26, 26, 0.95)'
          nav.style.backdropFilter = 'blur(10px)'
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="blog-page">
      {/* Blog Hero Section */}
      <section className="blog-listing-hero">
        <div className="blog-listing-hero-container">
          {featuredBlog && (
            <HeroBlogCard blog={featuredBlog} />
          )}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider"></div>

      {/* Blog Grid Section */}
      <section className="blog-grid-section">
        <div className="blog-grid-container">
          <div className="section-header">
            <h2 className="section-title">Latest Market Insights</h2>
            <p className="section-subtitle">Stay informed with our expert analysis and trending topics in luxury real estate markets worldwide.</p>
          </div>

          <div className="blog-grid" id="blogGrid">
            {currentBlogs.map((blog, index) => (
              <React.Fragment key={blog.id}>
                <BlogGridCard blog={blog} />
                {(index + 1) % 2 === 0 && index < currentBlogs.length - 1 && (
                  <div className="row-divider"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ← Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="pagination-btn" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default BlogPage 