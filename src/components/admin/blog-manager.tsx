"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Clock, User } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";

interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  author: {
    name: string;
    title?: string;
    avatar?: string;
    bio?: string;
  };
  date: string;
  readTime?: string;
  featured?: boolean;
  heroImage?: string;
  content: {
    lead: string;
    sections?: Array<{
      title?: string;
      content?: string;
      quote?: {
        text: string;
        author: string;
      };
      additional?: string;
      subsections?: Array<{
        title: string;
        content: string;
      }>;
    }>;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}

export function BlogManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogPost>({
    slug: "",
    title: "",
    subtitle: "",
    category: "",
    author: {
      name: "",
      title: "",
      avatar: "",
      bio: ""
    },
    date: new Date().toISOString().split('T')[0],
    readTime: "",
    featured: false,
    heroImage: "",
    content: {
      lead: "",
      sections: []
    },
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: ""
    },
    status: "draft"
  });

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const response = await fetch('/admin/api/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Reset form
  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      subtitle: "",
      category: "",
      author: {
        name: "",
        title: "",
        avatar: "",
        bio: ""
      },
      date: new Date().toISOString().split('T')[0],
      readTime: "",
      featured: false,
      heroImage: "",
      content: {
        lead: "",
        sections: []
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: ""
      },
      status: "draft"
    });
    setEditingBlog(null);
  };

  // Open modal for create/edit
  const openModal = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        slug: blog.slug,
        title: blog.title,
        subtitle: blog.subtitle || "",
        category: blog.category,
        author: {
          name: blog.author.name,
          title: blog.author.title || "",
          avatar: blog.author.avatar || "",
          bio: blog.author.bio || ""
        },
        date: new Date(blog.date).toISOString().split('T')[0],
        readTime: blog.readTime || "",
        featured: blog.featured || false,
        heroImage: blog.heroImage || "",
        content: {
          lead: blog.content.lead,
          sections: blog.content.sections || []
        },
        seo: {
          metaTitle: blog.seo?.metaTitle || "",
          metaDescription: blog.seo?.metaDescription || "",
          keywords: blog.seo?.keywords || ""
        },
        status: blog.status
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/admin/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';
      const body = editingBlog ? { 
        slug: formData.slug,
        title: formData.title,
        subtitle: formData.subtitle,
        category: formData.category,
        author: formData.author,
        date: formData.date,
        readTime: formData.readTime,
        featured: formData.featured,
        heroImage: formData.heroImage,
        content: formData.content,
        seo: formData.seo,
        status: formData.status,
        _id: editingBlog._id 
      } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save blog');
      }

      toast.success(`Blog ${editingBlog ? 'updated' : 'created'} successfully`);

      setIsModalOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save blog");
    }
  };

  // Delete blog
  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch('/admin/api/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id })
      });

      if (!response.ok) throw new Error('Failed to delete blog');

      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof BlogPost] as Record<string, string | boolean>;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Manager</h2>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Blog
        </Button>
      </div>

      {/* Blog List */}
      <div className="grid gap-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    blog.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {blog.status}
                  </span>
                  {blog.featured && (
                    <span className="px-2 py-1 rounded text-xs font-medium border border-yellow-300 text-yellow-700">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                {blog.subtitle && (
                  <p className="text-gray-600 mb-3">{blog.subtitle}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {blog.author.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(blog.date).toLocaleDateString()}
                  </div>
                  {blog.readTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {blog.readTime}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Slug: {blog.slug}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Category: {blog.category}
                </p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {blog.content.lead}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  className="p-2 border rounded hover:bg-gray-50"
                  onClick={() => openModal(blog)}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 border rounded hover:bg-red-50 text-red-600"
                  onClick={() => deleteBlog(blog._id!)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No blogs found. Create your first blog post!
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleFieldChange('slug', e.target.value)}
                    placeholder="my-blog-post"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder="Blog Title"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                  placeholder="Brief description"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    placeholder="Marketing"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => handleFieldChange('readTime', e.target.value)}
                    placeholder="5 min read"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Author Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Author Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Author Name *</label>
                    <input
                      type="text"
                      value={formData.author.name}
                      onChange={(e) => handleFieldChange('author.name', e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Author Title</label>
                    <input
                      type="text"
                      value={formData.author.title}
                      onChange={(e) => handleFieldChange('author.title', e.target.value)}
                      placeholder="Editor"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Avatar</label>
                    <input
                      type="text"
                      value={formData.author.avatar}
                      onChange={(e) => handleFieldChange('author.avatar', e.target.value)}
                      placeholder="JD"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <input
                      type="text"
                      value={formData.author.bio}
                      onChange={(e) => handleFieldChange('author.bio', e.target.value)}
                      placeholder="Author bio"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Content</h4>
                <div>
                  <label className="block text-sm font-medium mb-1">Lead Paragraph *</label>
                  <textarea
                    value={formData.content.lead}
                    onChange={(e) => handleFieldChange('content.lead', e.target.value)}
                    placeholder="Opening paragraph..."
                    rows={4}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hero Image URL</label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => handleFieldChange('heroImage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">SEO</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={formData.seo?.metaTitle}
                      onChange={(e) => handleFieldChange('seo.metaTitle', e.target.value)}
                      placeholder="SEO Title"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                    <textarea
                      value={formData.seo?.metaDescription}
                      onChange={(e) => handleFieldChange('seo.metaDescription', e.target.value)}
                      placeholder="SEO description"
                      rows={3}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Keywords</label>
                    <input
                      type="text"
                      value={formData.seo?.keywords}
                      onChange={(e) => handleFieldChange('seo.keywords', e.target.value)}
                      placeholder="blog, marketing, tips"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleFieldChange('featured', e.target.checked)}
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Featured</label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}