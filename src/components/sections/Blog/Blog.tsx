import React from 'react'

const Blog = () => {
  return (
    <section className="blog-section" id="blog">
      <div className="section-header">
        <h2 className="section-title">Latest Insights</h2>
        <p className="section-subtitle">Discover our expert perspectives on luxury real estate markets worldwide.</p>
      </div>
      <div className="blog-container">
        <div className="blog-card">
          <div className="blog-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')" }}></div>
          <div className="blog-content">
            <div className="blog-date">June 15, 2023</div>
            <h3 className="blog-title">The Future of Luxury: Emerging Markets to Watch in 2024</h3>
            <p className="blog-excerpt">As global wealth patterns shift, we analyze the rising stars in luxury real estate that savvy investors should have on their radar for the coming year.</p>
            <a href="#" className="blog-link">Read Article</a>
          </div>
        </div>
      </div>
      <div className="see-more">
        <a href="#" className="see-more-link">Explore More Insights</a>
      </div>
    </section>
  )
}

export default Blog