import React from 'react'
import { useTranslations } from 'next-intl'

const Blog = () => {
  const t = useTranslations('blog');

  return (
    <section className="blog-section" id="blog">
      <div className="section-header">
        <h2 className="section-title">{t('title')}</h2>
        <p className="section-subtitle">{t('subtitle')}</p>
      </div>
      <div className="blog-container">
        <div className="blog-card">
          <div className="blog-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')" }}></div>
          <div className="blog-content">
            <div className="blog-date">{t('date')}</div>
            <h3 className="blog-title">{t('articleTitle')}</h3>
            <p className="blog-excerpt">{t('excerpt')}</p>
            <a href="#" className="blog-link">{t('readArticle')}</a>
          </div>
        </div>
      </div>
      <div className="see-more">
        <a href="#" className="see-more-link">{t('exploreMore')}</a>
      </div>
    </section>
  )
}

export default Blog