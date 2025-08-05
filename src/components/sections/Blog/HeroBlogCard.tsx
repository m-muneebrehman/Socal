import React from 'react'
import { Link } from '@/i18n/navigation'

interface Blog {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  author: {
    name: string
    title: string
    avatar: string
  }
  date: string
  readTime: string
  heroImage: string
}

interface HeroBlogCardProps {
  blog: Blog
}

const HeroBlogCard = ({ blog }: HeroBlogCardProps) => {
  return (
    <Link href={`/blog/${blog.slug}`} className="hero-blog-card">
      <div 
        className="hero-blog-image" 
        style={{ backgroundImage: `url('${blog.heroImage}')` }}
      >
        <div className="featured-badge">Featured</div>
      </div>
      <div className="hero-blog-content">
        <div className="hero-blog-meta">
          <div className="hero-blog-category">{blog.category}</div>
          <div className="hero-blog-date">{blog.date}</div>
        </div>
        <h1 className="hero-blog-title">{blog.title}</h1>
        <p className="hero-blog-excerpt">{blog.subtitle}</p>
        <div className="hero-blog-footer">
          <div className="hero-blog-author">
            <div className="author-avatar">{blog.author.avatar}</div>
            <div className="author-info">
              <h4>{blog.author.name}</h4>
              <span>{blog.author.title}</span>
            </div>
          </div>
          <div className="hero-read-time">{blog.readTime}</div>
        </div>
      </div>
    </Link>
  )
}

export default HeroBlogCard 