"use client"

import { Plus, Edit2, Trash2, User, Calendar, Clock, Eye, Heart } from "lucide-react"
import { Blog as BlogType } from "@/types"

interface BlogManagerProps {
  blogs: BlogType[]
  setShowBlogModal: (show: boolean) => void
  setEditingBlog: (id: string | null) => void
  setBlogForm: (form: any) => void
  deleteBlog: (id: string) => void
  handleAddBlog: () => void
}

export default function BlogManager({ 
  blogs, 
  setShowBlogModal, 
  setEditingBlog, 
  setBlogForm, 
  deleteBlog,
  handleAddBlog
}: BlogManagerProps) {
  return (
    <div className="content-section">
      <div className="section-header">
        <div className="section-info">
          <div className="count-badge purple">
            <span>Total Posts: </span>
            <span>{blogs.length}</span>
          </div>
        </div>
        <button onClick={handleAddBlog} className="add-btn purple">
          <Plus size={20} />
          <span>Add Blog</span>
        </button>
      </div>

             <div className="content-grid two-cols">
         {blogs.map((blog) => (
           <div key={blog._id || blog.id || Math.random()} className="card">
            <div className="card-header">
              <div className="blog-badges">
                <span className={`badge ${blog.status.toLowerCase()}`}>{blog.status}</span>
                {blog.featured && <span className="badge featured">Featured</span>}
              </div>
              <div className="card-actions">
                                 <button 
                   className="action-btn edit"
                   onClick={() => {
                     const blogId = blog._id || blog.id || ''
                     setEditingBlog(blogId)
                     setBlogForm({
                       _id: blogId,
                       slug: blog.slug,
                       title: blog.title,
                       subtitle: blog.subtitle || '',
                       category: blog.category,
                       author: typeof blog.author === 'string' ? blog.author : blog.author?.name || '',
                       status: blog.status,
                       featured: blog.featured ? 'Yes' : 'No',
                       content: { lead: blog.content?.lead || '' }
                     })
                     setShowBlogModal(true)
                   }}
                 >
                  <Edit2 size={16} />
                </button>
                                 <button className="action-btn delete" onClick={() => {
                   const blogId = blog._id || blog.id || ''
                   if (blogId) {
                     deleteBlog(blogId)
                   }
                 }}>
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>

            <h3 className="card-title">{blog.title}</h3>
            <p className="card-subtitle">{blog.subtitle || 'No subtitle'}</p>

            <div className="card-meta">
              <span>
                <User size={16} />
                {typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Unknown Author'}
              </span>
              <span>
                <Calendar size={16} />
                {new Date(blog.date).toLocaleDateString()}
              </span>
              <span>
                <Clock size={16} />
                4 min read
              </span>
            </div>

            <div className="card-meta">
              <span>Slug: {blog.slug}</span>
              <span>Category: {blog.category}</span>
            </div>

            <p className="blog-content">{blog.content?.lead || 'No content available...'}</p>

            <div className="blog-stats">
              <span>
                <Eye size={16} />
                {blog.views || 0}
              </span>
              <span>
                <Heart size={16} />
                {blog.likes || 0}
              </span>
            </div>
          </div>
        ))}
        {blogs.length === 0 && (
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">No blog posts found</h3>
                <p className="card-subtitle">Create your first blog post to get started</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
