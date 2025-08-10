import React from 'react'
import { Link } from '@/i18n/navigation'
import blogsData from '@/data/blogs.json'
import { useParams } from 'next/navigation'

interface RelatedArticlesProps {
  currentBlogId: string
}

const RelatedArticles = ({ currentBlogId }: RelatedArticlesProps) => {
  const params = useParams() as any
  const locale = params?.locale || 'en'
  // Prefer same-locale blogs if present in data
  const sameLocale = blogsData.filter((b: any) => (b as any).language === locale)
  const pool = sameLocale.length > 0 ? sameLocale : blogsData
  const relatedBlogs = pool.filter(blog => blog.id !== currentBlogId).slice(0, 3)

  return (
    <section className="related-section">
      <div className="related-container">
        <div className="section-header">
          <h2 className="section-title">Related Insights</h2>
          <p className="section-subtitle">Continue exploring our latest analysis and trends in luxury real estate markets worldwide</p>
        </div>

        <div className="related-grid">
          {relatedBlogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} locale={locale} className="related-card fade-in">
              <div className="related-card-image">
                <img src={blog.heroImage} alt={blog.title} />
              </div>
              <div className="related-card-content">
                <div className="related-card-meta">
                  <div className="related-card-category">{blog.category}</div>
                  <div className="related-card-date">{blog.date}</div>
                </div>
                <h3 className="related-card-title">{blog.title}</h3>
                <p className="related-card-excerpt">{blog.subtitle}</p>
                <div className="related-card-footer">
                  <span>{blog.author.name}</span>
                  <span>
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    {blog.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedArticles 