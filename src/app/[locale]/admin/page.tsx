"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Edit3, 
  Menu, 
  Search, 
  Bell, 
  Settings,
  Eye,
  Heart,
  User,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  Home,
  Clock
} from "lucide-react"


const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users },
  { key: "cities", label: "Cities", icon: MapPin },
  { key: "blogs", label: "Blogs", icon: Edit3 },
]

// Types for our data
interface User {
  _id: string
  email: string
  role?: string
  createdAt: string
  status?: string
}

interface Blog {
  _id: string
  slug: string
  title: string
  subtitle?: string
  category: string
  author: string | { name: string; avatar?: string; bio?: string }
  date: string
  status: string
  featured?: boolean
  content: {
    lead: string
  }
  views?: number
  likes?: number
}

interface City {
  _id?: string
  id?: string
  slug: string
  name: string
  state: string
  shortDescription: string
  fullDescription?: string
  heroImage?: string
  population: string
  avgHomePrice: string
  tags: string[]
  neighborhoods: string[]
  highlights: {
    title: string
    description: string
    icon: string
    bgImage: string
  }[]
  faqs: {
    question: string
    answer: string
    category: string
  }[]
  clients?: {
    name: string
    description: string
    image: string
    rating: number
    review: string
  }[]
}

interface DashboardStats {
  users: number
  cities: number
  blogs: number
  totalViews: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [showCityModal, setShowCityModal] = useState(false)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editingBlog, setEditingBlog] = useState<string | null>(null)
  const [editingCity, setEditingCity] = useState<string | null>(null)
  
  // Data states
  const [users, setUsers] = useState<User[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    cities: 0,
    blogs: 0,
    totalViews: 0
  })
  
  // Form states
  const [userForm, setUserForm] = useState({ _id: '', email: '', password: '', role: 'User', status: 'Active' })
  const [blogForm, setBlogForm] = useState({ 
    _id: '',
    slug: '', 
    title: '', 
    subtitle: '', 
    category: 'Marketing', 
    author: '', 
    status: 'Draft', 
    featured: 'No',
    content: { lead: '' }
  })
  const [cityForm, setCityForm] = useState({
    _id: '',
    slug: '',
    name: '',
    state: '',
    population: '',
    avgHomePrice: '',
    heroImage: '',
    shortDescription: '',
    tags: '',
    neighborhoods: [''],
    highlights: [{ title: '', description: '', icon: '', bgImage: '' }],
    faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],
    fullDescription: '',
    clients: [{ name: '', description: '', image: '', rating: 5, review: '' }]
  })
  
  const [loadingData, setLoadingData] = useState(false)
  const router = useRouter()

  // API functions
  const fetchUsers = async () => {
    try {
      const response = await fetch('/admin/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/admin/api/blogs')
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
  }

  const fetchCities = async () => {
    try {
      const response = await fetch('/admin/api/cities')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched cities data:', data)
        setCities(data)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/admin/api/dashboard-stats')
      if (response.ok) {
        const data = await response.json()
        setStats({
          users: data.users || users.length,
          cities: data.cities || cities.length,
          blogs: data.blogs || blogs.length,
          totalViews: data.totalViews || 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const createUser = async (userData: any) => {
    try {
      const response = await fetch('/admin/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      if (response.ok) {
        await fetchUsers()
        setShowUserModal(false)
        setUserForm({ _id: '', email: '', password: '', role: 'User', status: 'Active' })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    }
  }

  const createBlog = async (blogData: any) => {
    try {
      const response = await fetch('/admin/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogData,
          date: new Date().toISOString(),
          featured: blogData.featured === 'Yes',
          author: blogData.author // Keep as string for new blogs
        })
      })
      if (response.ok) {
        await fetchBlogs()
        setShowBlogModal(false)
        setBlogForm({ 
          _id: '',
          slug: '', 
          title: '', 
          subtitle: '', 
          category: 'Marketing', 
          author: '', 
          status: 'Draft', 
          featured: 'No',
          content: { lead: '' }
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create blog')
      }
    } catch (error) {
      console.error('Error creating blog:', error)
      alert('Failed to create blog')
    }
  }

  const createCity = async (cityData: any) => {
    try {
      // Filter out empty values from arrays
      const filteredNeighborhoods = cityData.neighborhoods.filter((n: string) => n.trim() !== '')
      const filteredHighlights = cityData.highlights.filter((h: any) => 
        h && h.title && h.description && h.title.trim() !== '' && h.description.trim() !== ''
      )
      const filteredFaqs = cityData.faqs.filter((f: any) => 
        f && f.question && f.answer && 
        f.question.trim() !== '' && f.answer.trim() !== ''
      )
      const filteredClients = cityData.clients?.filter((c: any) => 
        c && c.name && c.description && c.name.trim() !== '' && c.description.trim() !== ''
      ) || []

      // Process tags safely
      let processedTags = []
      if (typeof cityData.tags === 'string' && cityData.tags.trim() !== '') {
        processedTags = cityData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '')
      } else if (Array.isArray(cityData.tags)) {
        processedTags = cityData.tags.filter((tag: string) => tag.trim() !== '')
      }

      const cityPayload = {
        slug: cityData.slug,
        name: cityData.name,
        state: cityData.state,
        population: cityData.population,
        avgHomePrice: cityData.avgHomePrice,
        heroImage: cityData.heroImage,
        shortDescription: cityData.shortDescription,
        fullDescription: cityData.fullDescription,
        tags: processedTags,
        neighborhoods: filteredNeighborhoods,
        highlights: filteredHighlights,
        faqs: filteredFaqs,
        clients: filteredClients
      }

      console.log('Sending city data:', cityPayload)

      const response = await fetch('/admin/api/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityPayload)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('City created successfully:', result)
        await fetchCities()
        setShowCityModal(false)
        setCityForm({
          _id: '',
          slug: '',
          name: '',
          state: '',
          population: '',
          avgHomePrice: '',
          heroImage: '',
          shortDescription: '',
          tags: '',
          neighborhoods: [''],
          highlights: [{ title: '', description: '', icon: '', bgImage: '' }],
          faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],
          fullDescription: '',
          clients: [{ name: '', description: '', image: '', rating: 5, review: '' }]
        })
      } else {
        const error = await response.json()
        console.error('Server error:', error)
        alert(error.error || 'Failed to create city')
      }
    } catch (error) {
      console.error('Error creating city:', error)
      alert('Failed to create city: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const deleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch('/admin/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id })
        })
        if (response.ok) {
          await fetchUsers()
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const deleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch('/admin/api/blogs', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id })
        })
        if (response.ok) {
          await fetchBlogs()
        }
      } catch (error) {
        console.error('Error deleting blog:', error)
      }
    }
  }

  const deleteCity = async (id: string) => {
    if (confirm('Are you sure you want to delete this city?')) {
      try {
        console.log('Deleting city with ID:', id)
        
        if (!id || id.trim() === '') {
          alert('Cannot delete city: Invalid ID')
          return
        }

        const response = await fetch('/admin/api/cities', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id })
        })
        
        if (response.ok) {
          await fetchCities()
        } else {
          const error = await response.json()
          console.error('Server error:', error)
          alert(error.error || 'Failed to delete city')
        }
      } catch (error) {
        console.error('Error deleting city:', error)
        alert('Failed to delete city: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
  }

  const updateUser = async (userData: any) => {
    try {
      const response = await fetch('/admin/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      if (response.ok) {
        await fetchUsers()
        setShowUserModal(false)
        setEditingUser(null)
        setUserForm({ _id: '', email: '', password: '', role: 'User', status: 'Active' })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Failed to update user')
    }
  }

  const updateBlog = async (blogData: any) => {
    try {
      const response = await fetch('/admin/api/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogData,
          featured: blogData.featured === 'Yes',
          author: blogData.author
        })
      })
      if (response.ok) {
        await fetchBlogs()
        setShowBlogModal(false)
        setEditingBlog(null)
        setBlogForm({ 
          _id: '',
          slug: '', 
          title: '', 
          subtitle: '', 
          category: 'Marketing', 
          author: '', 
          status: 'Draft', 
          featured: 'No',
          content: { lead: '' }
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      alert('Failed to update blog')
    }
  }

  const updateCity = async (cityData: any) => {
    try {
      // Filter out empty values from arrays
      const filteredNeighborhoods = cityData.neighborhoods.filter((n: string) => n.trim() !== '')
      const filteredHighlights = cityData.highlights.filter((h: any) => 
        h && h.title && h.description && h.title.trim() !== '' && h.description.trim() !== ''
      )
      const filteredFaqs = cityData.faqs.filter((f: any) => 
        f && f.question && f.answer && 
        f.question.trim() !== '' && f.answer.trim() !== ''
      )
      const filteredClients = cityData.clients?.filter((c: any) => 
        c && c.name && c.description && c.name.trim() !== '' && c.description.trim() !== ''
      ) || []

      // Process tags safely
      let processedTags = []
      if (typeof cityData.tags === 'string' && cityData.tags.trim() !== '') {
        processedTags = cityData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '')
      } else if (Array.isArray(cityData.tags)) {
        processedTags = cityData.tags.filter((tag: string) => tag.trim() !== '')
      }

      const cityPayload = {
        _id: cityData._id,
        slug: cityData.slug,
        name: cityData.name,
        state: cityData.state,
        population: cityData.population,
        avgHomePrice: cityData.avgHomePrice,
        heroImage: cityData.heroImage,
        shortDescription: cityData.shortDescription,
        fullDescription: cityData.fullDescription,
        tags: processedTags,
        neighborhoods: filteredNeighborhoods,
        highlights: filteredHighlights,
        faqs: filteredFaqs,
        clients: filteredClients
      }

      console.log('Updating city data:', cityPayload)

      const response = await fetch('/admin/api/cities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityPayload)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('City updated successfully:', result)
        await fetchCities()
        setShowCityModal(false)
        setEditingCity(null)
        setCityForm({
          _id: '',
          slug: '',
          name: '',
          state: '',
          population: '',
          avgHomePrice: '',
          heroImage: '',
          shortDescription: '',
          tags: '',
          neighborhoods: [''],
          highlights: [{ title: '', description: '', icon: '', bgImage: '' }],
          faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],
          fullDescription: '',
          clients: [{ name: '', description: '', image: '', rating: 5, review: '' }]
        })
      } else {
        const error = await response.json()
        console.error('Server error:', error)
        alert(error.error || 'Failed to update city')
      }
    } catch (error) {
      console.error('Error updating city:', error)
      alert('Failed to update city: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== "undefined") {
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
        const userEmail = localStorage.getItem("adminUserEmail")
        
        if (!isLoggedIn) {
          router.push("/admin/login")
          return
        }
        
        if (userEmail) {
          setUser({ email: userEmail })
        } else {
          setUser({ email: "admin@example.com" })
        }
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  // Fetch data when component mounts
  useEffect(() => {
    if (user) {
      setLoadingData(true)
      Promise.all([fetchUsers(), fetchBlogs(), fetchCities(), fetchStats()])
        .finally(() => setLoadingData(false))
    }
  }, [user])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAdminLoggedIn")
      localStorage.removeItem("adminUserEmail")
    }
    router.push("/admin/login")
  }

  const getPageInfo = () => {
    switch(activeSection) {
      case "dashboard":
        return { title: "Dashboard Overview", subtitle: "Welcome back! Here's what's happening." }
      case "users":
        return { title: "User Management", subtitle: `Manage your ${users.length} users` }
      case "cities":
        return { title: "City Management", subtitle: `Manage your ${cities.length} cities` }
      case "blogs":
        return { title: "Blog Manager", subtitle: `Manage your ${blogs.length} blog posts` }
      default:
        return { title: "Dashboard Overview", subtitle: "Welcome back! Here's what's happening." }
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (loadingData) {
    return (
      <div className="admin-dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const pageInfo = getPageInfo()

  return (
    <div className="admin-dashboard">
        {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-content">
            <div className="logo-icon">
              <LayoutDashboard size={24} />
            </div>
            <div className="logo-text">
              <h1>Admin Panel</h1>
              <p>Management System</p>
            </div>
          </div>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="toggle-btn">
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                className={`nav-item ${activeSection === item.key ? 'active' : ''}`}
                onClick={() => setActiveSection(item.key)}
              >
                <Icon size={20} />
                <span className="nav-text">{item.label}</span>
              </button>
            )
          })}
          </nav>
      </div>

        {/* Main Content */}
      <div className={`admin-main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Header */}
        <header className="admin-header">
          <div className="header-content">
            <div>
              <h2 className="page-title">{pageInfo.title}</h2>
              <p className="page-subtitle">{pageInfo.subtitle}</p>
            </div>
            <div className="header-actions">
              <div className="search-container">
                <Search className="search-icon" size={16} />
                <input type="text" placeholder="Search..." className="search-input" />
              </div>
              <button className="header-btn">
                <Bell size={20} />
                <span className="notification-dot"></span>
              </button>
              <button 
                className="header-btn"
                onClick={async () => {
                  try {
                    const response = await fetch('/admin/api/update-json', { method: 'POST' })
                    if (response.ok) {
                      alert('JSON files updated successfully!')
                    } else {
                      alert('Failed to update JSON files')
                    }
                  } catch (error) {
                    console.error('Error updating JSON files:', error)
                    alert('Error updating JSON files')
                  }
                }}
                title="Update JSON Files"
              >
                <Settings size={20} />
              </button>
              <button onClick={handleLogout} className="header-btn">
                <User size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div className="content-section">
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-content">
                    <div className="stat-info">
                      <p>Total Users</p>
                      <p className="stat-number">{stats.users}</p>
                      <p className="stat-change">+12%</p>
                    </div>
                    <div className="stat-icon blue">
                      <Users size={24} />
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <div className="stat-info">
                      <p>Cities</p>
                      <p className="stat-number">{stats.cities}</p>
                      <p className="stat-change">+5%</p>
                    </div>
                    <div className="stat-icon green">
                      <MapPin size={24} />
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <div className="stat-info">
                      <p>Blog Posts</p>
                      <p className="stat-number">{stats.blogs}</p>
                      <p className="stat-change">+18%</p>
                    </div>
                    <div className="stat-icon purple">
                      <Edit3 size={24} />
                    </div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-content">
                    <div className="stat-info">
                      <p>Total Views</p>
                      <p className="stat-number">{stats.totalViews.toLocaleString()}</p>
                      <p className="stat-change">+23%</p>
                    </div>
                    <div className="stat-icon orange">
                      <Eye size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="activity-grid">
                <div className="activity-card">
                  <h3 className="activity-title">Recent Users</h3>
                  <div className="activity-list">
                    {users.slice(0, 3).map((user) => (
                      <div key={user._id} className="activity-item">
                        <div className="activity-avatar">
                          <User size={20} />
                        </div>
                        <div className="activity-info">
                          <p>{user.email}</p>
                          <p>{user.role || 'User'}</p>
                        </div>
                        <span className="status-badge status-active">{user.status || 'active'}</span>
                      </div>
                    ))}
                    {users.length === 0 && (
                      <div className="activity-item">
                        <div className="activity-info">
                          <p>No users found</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="activity-card">
                  <h3 className="activity-title">Popular Posts</h3>
                  <div className="activity-list">
                    {blogs.slice(0, 3).map((blog) => (
                      <div key={blog._id} className="activity-item">
                        <div className="activity-avatar purple">
                          <Edit3 size={20} />
                        </div>
                        <div className="activity-info">
                          <p>{blog.title}</p>
                          <div className="activity-meta">
                            <Eye size={16} />
                            <span>{blog.views || 0}</span>
                            <Heart size={16} />
                            <span>{blog.likes || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {blogs.length === 0 && (
                      <div className="activity-item">
                        <div className="activity-info">
                          <p>No blog posts found</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeSection === "users" && (
            <div className="content-section">
              <div className="section-header">
                <div className="section-info">
                  <div className="count-badge blue">
                    <span>Total Users: </span>
                    <span>{users.length}</span>
                  </div>
                </div>
                <button onClick={() => setShowUserModal(true)} className="add-btn blue">
                  <Plus size={20} />
                  <span>Add User</span>
                </button>
              </div>

              <div className="content-grid">
                {users.map((user) => (
                  <div key={user._id} className="card">
                    <div className="user-card-content">
                      <div className="user-info">
                        <div className="user-avatar">
                          <User size={24} />
                        </div>
                        <div className="user-details">
                          <h3>{user.email}</h3>
                          <div className="user-meta">
                            <span>
                              <Calendar size={16} />
                              Created: {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                            <span>Role: {user.role || 'User'}</span>
                            <span className="status-badge status-active">{user.status || 'active'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button 
                          className="action-btn edit"
                          onClick={() => {
                            setEditingUser(user._id)
                            setUserForm({
                              _id: user._id,
                              email: user.email,
                              password: '',
                              role: user.role || 'User',
                              status: user.status || 'Active'
                            })
                            setShowUserModal(true)
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete" onClick={() => deleteUser(user._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="card">
                    <div className="user-card-content">
                      <div className="user-info">
                        <div className="user-details">
                          <h3>No users found</h3>
                          <p>Create your first user to get started</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cities Section */}
          {activeSection === "cities" && (
            <div className="content-section">
              <div className="section-header">
                <div className="section-info">
                  <div className="count-badge green">
                    <span>Total Cities: </span>
                    <span>{cities.length}</span>
                  </div>
                </div>
                <button onClick={() => setShowCityModal(true)} className="add-btn green">
                  <Plus size={20} />
                  <span>Add City</span>
                </button>
              </div>

              <div className="content-grid two-cols">
                {cities.map((city) => (
                  <div key={city._id || city.id || Math.random()} className="card">
                    <div className="card-header">
                      <div>
                        <h3 className="card-title">{city.name}, {city.state}</h3>
                        <p className="card-subtitle">{city.shortDescription}</p>
                      </div>
                      <div className="card-actions">
                        <button 
                          className="action-btn edit"
                          onClick={() => {
                            const cityId = city._id || city.id || ''
                            setEditingCity(cityId)
                            setCityForm({
                              _id: cityId,
                              slug: city.slug,
                              name: city.name,
                              state: city.state,
                              population: city.population,
                              avgHomePrice: city.avgHomePrice,
                              heroImage: city.heroImage || '',
                              shortDescription: city.shortDescription,
                              fullDescription: city.fullDescription || '',
                              tags: city.tags?.join(', ') || '',
                              neighborhoods: city.neighborhoods?.length > 0 ? city.neighborhoods : [''],
                              highlights: city.highlights?.length > 0 ? city.highlights : [{ title: '', description: '', icon: '', bgImage: '' }],
                              faqs: city.faqs?.length > 0 ? city.faqs : [{ question: '', answer: '', category: 'Neighborhoods' }],
                              clients: city.clients && city.clients.length > 0 ? city.clients : [{ name: '', description: '', image: '', rating: 5, review: '' }]
                            })
                            setShowCityModal(true)
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete" onClick={() => {
                          console.log('City object for deletion:', city)
                          const cityId = city._id || city.id || ''
                          console.log('Extracted city ID:', cityId)
                          if (cityId) {
                            deleteCity(cityId)
                          } else {
                            alert('Cannot delete city: No valid ID found')
                          }
                        }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="city-stats">
                      <div className="city-stat blue">
                        <Users className="city-stat-icon blue" size={20} />
                        <p>{city.population}</p>
                        <p>Population</p>
                      </div>
                      <div className="city-stat green">
                        <Home className="city-stat-icon green" size={20} />
                        <p>{city.avgHomePrice}</p>
                        <p>Avg Price</p>
                      </div>
                      <div className="city-stat purple">
                        <MapPin className="city-stat-icon purple" size={20} />
                        <p>{city.neighborhoods?.length || 0}</p>
                        <p>Areas</p>
                      </div>
                    </div>

                    <div className="tags">
                      {city.tags?.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                      {city.tags?.length > 3 && (
                        <span className="tag gray">+{city.tags.length - 3} more</span>
                      )}
                    </div>

                    <div className="card-meta">
                      <span>Slug: {city.slug}</span>
                      <span>{city.highlights?.length || 0} highlights</span>
                      <span>{city.faqs?.length || 0} FAQs</span>
                    </div>
                  </div>
                ))}
                {cities.length === 0 && (
                  <div className="card">
                    <div className="card-header">
                      <div>
                        <h3 className="card-title">No cities found</h3>
                        <p className="card-subtitle">Create your first city to get started</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blogs Section */}
          {activeSection === "blogs" && (
            <div className="content-section">
              <div className="section-header">
                <div className="section-info">
                  <div className="count-badge purple">
                    <span>Total Posts: </span>
                    <span>{blogs.length}</span>
                  </div>
                </div>
                <button onClick={() => setShowBlogModal(true)} className="add-btn purple">
                  <Plus size={20} />
                  <span>Add Blog</span>
                </button>
              </div>

              <div className="content-grid two-cols">
                {blogs.map((blog) => (
                  <div key={blog._id} className="card">
                    <div className="card-header">
                      <div className="blog-badges">
                        <span className={`badge ${blog.status.toLowerCase()}`}>{blog.status}</span>
                        {blog.featured && <span className="badge featured">Featured</span>}
                      </div>
                      <div className="card-actions">
                        <button 
                          className="action-btn edit"
                          onClick={() => {
                            setEditingBlog(blog._id)
                            setBlogForm({
                              _id: blog._id,
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
                        <button className="action-btn delete" onClick={() => deleteBlog(blog._id)}>
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
          )}
        </main>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="modal show" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingUser ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => {
                setShowUserModal(false)
                setEditingUser(null)
                setUserForm({ _id: '', email: '', password: '', role: 'User', status: 'Active' })
              }} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={(e) => {
                e.preventDefault()
                if (editingUser) {
                  updateUser(userForm)
                } else {
                  createUser(userForm)
                }
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Email <span className="required">*</span>
                    </label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="user@example.com"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Password <span className="required">*</span>
                    </label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="Password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Role <span className="required">*</span>
                    </label>
                    <select 
                      className="form-select"
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                      required
                    >
                      <option>Admin</option>
                      <option>Editor</option>
                      <option>User</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select"
                      value={userForm.status}
                      onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => {
                setShowUserModal(false)
                setEditingUser(null)
                setUserForm({ _id: '', email: '', password: '', role: 'User', status: 'Active' })
              }} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">{editingUser ? 'Update User' : 'Save User'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {showBlogModal && (
        <div className="modal show" onClick={() => setShowBlogModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingBlog ? 'Edit Blog' : 'Add Blog'}</h2>
              <button onClick={() => {
                setShowBlogModal(false)
                setEditingBlog(null)
                setBlogForm({ 
                  _id: '',
                  slug: '', 
                  title: '', 
                  subtitle: '', 
                  category: 'Marketing', 
                  author: '', 
                  status: 'Draft', 
                  featured: 'No',
                  content: { lead: '' }
                })
              }} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={(e) => {
                e.preventDefault()
                if (editingBlog) {
                  updateBlog(blogForm)
                } else {
                  createBlog(blogForm)
                }
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Slug <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="my-blog-slug"
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm({...blogForm, slug: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Blog Title"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Subtitle</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Blog subtitle"
                      value={blogForm.subtitle}
                      onChange={(e) => setBlogForm({...blogForm, subtitle: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category <span className="required">*</span></label>
                    <select 
                      className="form-select"
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                      required
                    >
                      <option>Marketing</option>
                      <option>Technology</option>
                      <option>Business</option>
                      <option>Lifestyle</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Author <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="John Doe"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({...blogForm, author: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status <span className="required">*</span></label>
                    <select 
                      className="form-select"
                      value={blogForm.status}
                      onChange={(e) => setBlogForm({...blogForm, status: e.target.value})}
                      required
                    >
                      <option>Draft</option>
                      <option>Published</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Featured</label>
                    <select 
                      className="form-select"
                      value={blogForm.featured}
                      onChange={(e) => setBlogForm({...blogForm, featured: e.target.value})}
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Content <span className="required">*</span></label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Write your blog content here..."
                    value={blogForm.content.lead}
                    onChange={(e) => setBlogForm({...blogForm, content: { lead: e.target.value }})}
                    required
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => {
                setShowBlogModal(false)
                setEditingBlog(null)
                setBlogForm({ 
                  _id: '',
                  slug: '', 
                  title: '', 
                  subtitle: '', 
                  category: 'Marketing', 
                  author: '', 
                  status: 'Draft', 
                  featured: 'No',
                  content: { lead: '' }
                })
              }} className="btn btn-secondary">Cancel</button>
              <button type="button" onClick={() => {
                if (editingBlog) {
                  updateBlog(blogForm)
                } else {
                  createBlog(blogForm)
                }
              }} className="btn btn-primary">{editingBlog ? 'Update Blog' : 'Save Blog'}</button>
            </div>
          </div>
        </div>
      )}

      {/* City Modal */}
      {showCityModal && (
        <div className="modal show" onClick={() => setShowCityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingCity ? 'Edit City' : 'Add City'}</h2>
              <button onClick={() => {
                setShowCityModal(false)
                setEditingCity(null)
                setCityForm({
                  _id: '',
                  slug: '',
                  name: '',
                  state: '',
                  population: '',
                  avgHomePrice: '',
                  heroImage: '',
                  shortDescription: '',
                  tags: '',
                  neighborhoods: [''],
                  highlights: [{ title: '', description: '', icon: '', bgImage: '' }],
                  faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],
                  fullDescription: '',
                  clients: [{ name: '', description: '', image: '', rating: 5, review: '' }]
                })
              }} className="close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={(e) => {
                e.preventDefault()
                if (editingCity) {
                  updateCity(cityForm)
                } else {
                  createCity(cityForm)
                }
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Slug <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="los-angeles"
                      value={cityForm.slug}
                      onChange={(e) => setCityForm({...cityForm, slug: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Los Angeles"
                      value={cityForm.name}
                      onChange={(e) => setCityForm({...cityForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="California"
                      value={cityForm.state}
                      onChange={(e) => setCityForm({...cityForm, state: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Population <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="4M+"
                      value={cityForm.population}
                      onChange={(e) => setCityForm({...cityForm, population: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Average Home Price <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="$800K"
                      value={cityForm.avgHomePrice}
                      onChange={(e) => setCityForm({...cityForm, avgHomePrice: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hero Image URL <span className="required">*</span></label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://example.com/city-hero.jpg"
                      value={cityForm.heroImage}
                      onChange={(e) => setCityForm({...cityForm, heroImage: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Short Description <span className="required">*</span></label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="A brief description of the city..."
                    value={cityForm.shortDescription}
                    onChange={(e) => setCityForm({...cityForm, shortDescription: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Description <span className="required">*</span></label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Detailed description of the city..."
                    value={cityForm.fullDescription}
                    onChange={(e) => setCityForm({...cityForm, fullDescription: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags <span className="required">*</span></label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Entertainment, Beach, Culture, Hollywood (comma separated)"
                    value={cityForm.tags}
                    onChange={(e) => setCityForm({...cityForm, tags: e.target.value})}
                    required
                  />
                </div>

                {/* Neighborhoods */}
                <div className="form-group">
                  <label className="form-label">Neighborhoods <span className="required">*</span></label>
                  {cityForm.neighborhoods.map((neighborhood, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        className="form-input flex-1" 
                        placeholder="Hollywood"
                        value={neighborhood}
                        onChange={(e) => {
                          const newNeighborhoods = [...cityForm.neighborhoods]
                          newNeighborhoods[index] = e.target.value
                          setCityForm({...cityForm, neighborhoods: newNeighborhoods})
                        }}
                        required
                      />
                      {cityForm.neighborhoods.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newNeighborhoods = cityForm.neighborhoods.filter((_, i) => i !== index)
                            setCityForm({...cityForm, neighborhoods: newNeighborhoods})
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setCityForm({...cityForm, neighborhoods: [...cityForm.neighborhoods, '']})}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Neighborhood
                  </button>
                </div>

                {/* Highlights */}
                <div className="form-group">
                  <label className="form-label">Highlights <span className="required">*</span></label>
                  {cityForm.highlights.map((highlight, index) => (
                    <div key={index} className="p-4 rounded mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Title <span className="required">*</span></label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Hollywood & Entertainment"
                            value={highlight.title}
                            onChange={(e) => {
                              const newHighlights = [...cityForm.highlights]
                              newHighlights[index] = {...highlight, title: e.target.value}
                              setCityForm({...cityForm, highlights: newHighlights})
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Icon <span className="required">*</span></label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="🎬"
                            value={highlight.icon}
                            onChange={(e) => {
                              const newHighlights = [...cityForm.highlights]
                              newHighlights[index] = {...highlight, icon: e.target.value}
                              setCityForm({...cityForm, highlights: newHighlights})
                            }}
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Description <span className="required">*</span></label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Home to the world's largest entertainment industry..."
                          value={highlight.description}
                          onChange={(e) => {
                            const newHighlights = [...cityForm.highlights]
                            newHighlights[index] = {...highlight, description: e.target.value}
                            setCityForm({...cityForm, highlights: newHighlights})
                          }}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Background Image URL <span className="required">*</span></label>
                        <input 
                          type="url" 
                          className="form-input" 
                          placeholder="https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80"
                          value={highlight.bgImage}
                          onChange={(e) => {
                            const newHighlights = [...cityForm.highlights]
                            newHighlights[index] = {...highlight, bgImage: e.target.value}
                            setCityForm({...cityForm, highlights: newHighlights})
                          }}
                          required
                        />
                      </div>
                      {cityForm.highlights.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newHighlights = cityForm.highlights.filter((_, i) => i !== index)
                            setCityForm({...cityForm, highlights: newHighlights})
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove Highlight
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setCityForm({
                      ...cityForm, 
                      highlights: [...cityForm.highlights, { title: '', description: '', icon: '', bgImage: '' }]
                    })}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Highlight
                  </button>
                </div>

                {/* FAQs */}
                <div className="form-group">
                  <label className="form-label">FAQs <span className="required">*</span></label>
                  {cityForm.faqs.map((faq, index) => (
                    <div key={index} className="p-4 rounded mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Question <span className="required">*</span></label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="What's the best time to visit?"
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = [...cityForm.faqs]
                              newFaqs[index] = {...faq, question: e.target.value}
                              setCityForm({...cityForm, faqs: newFaqs})
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Category <span className="required">*</span></label>
                          <select 
                            className="form-select"
                            value={faq.category}
                            onChange={(e) => {
                              const newFaqs = [...cityForm.faqs]
                              newFaqs[index] = {...faq, category: e.target.value}
                              setCityForm({...cityForm, faqs: newFaqs})
                            }}
                            required
                          >
                            <option value="Neighborhoods">Neighborhoods</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Employment">Employment</option>
                            <option value="Transportation">Transportation</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="form-label">Answer <span className="required">*</span></label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Detailed answer..."
                          value={faq.answer}
                          onChange={(e) => {
                            const newFaqs = [...cityForm.faqs]
                            newFaqs[index] = {...faq, answer: e.target.value}
                            setCityForm({...cityForm, faqs: newFaqs})
                          }}
                          required
                        ></textarea>
                      </div>
                      {cityForm.faqs.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newFaqs = cityForm.faqs.filter((_, i) => i !== index)
                            setCityForm({...cityForm, faqs: newFaqs})
                          }}
                          className="mt-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove FAQ
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setCityForm({
                      ...cityForm, 
                      faqs: [...cityForm.faqs, { question: '', answer: '', category: 'Neighborhoods' }]
                    })}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add FAQ
                  </button>
                </div>

                {/* Clients */}
                <div className="form-group">
                  <label className="form-label">Client Testimonials</label>
                  {cityForm.clients?.map((client, index) => (
                    <div key={index} className="p-4 rounded mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Name <span className="required">*</span></label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Sarah Mitchell"
                            value={client.name}
                            onChange={(e) => {
                              const newClients = [...(cityForm.clients || [])]
                              newClients[index] = {...client, name: e.target.value}
                              setCityForm({...cityForm, clients: newClients})
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Description <span className="required">*</span></label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Tech Entrepreneur"
                            value={client.description}
                            onChange={(e) => {
                              const newClients = [...(cityForm.clients || [])]
                              newClients[index] = {...client, description: e.target.value}
                              setCityForm({...cityForm, clients: newClients})
                            }}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="form-label">Image URL <span className="required">*</span></label>
                          <input 
                            type="url" 
                            className="form-input" 
                            placeholder="https://images.unsplash.com/photo-1494790108755-2616b612b353?w=150&q=80"
                            value={client.image}
                            onChange={(e) => {
                              const newClients = [...(cityForm.clients || [])]
                              newClients[index] = {...client, image: e.target.value}
                              setCityForm({...cityForm, clients: newClients})
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Rating <span className="required">*</span></label>
                          <select 
                            className="form-select"
                            value={client.rating}
                            onChange={(e) => {
                              const newClients = [...(cityForm.clients || [])]
                              newClients[index] = {...client, rating: parseInt(e.target.value)}
                              setCityForm({...cityForm, clients: newClients})
                            }}
                            required
                          >
                            <option value={1}>1 Star</option>
                            <option value={2}>2 Stars</option>
                            <option value={3}>3 Stars</option>
                            <option value={4}>4 Stars</option>
                            <option value={5}>5 Stars</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Review <span className="required">*</span></label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Found my dream home in Venice Beach! The team understood exactly what I was looking for and made the process seamless."
                          value={client.review}
                          onChange={(e) => {
                            const newClients = [...(cityForm.clients || [])]
                            newClients[index] = {...client, review: e.target.value}
                            setCityForm({...cityForm, clients: newClients})
                          }}
                          required
                        ></textarea>
                      </div>
                      {(cityForm.clients?.length || 0) > 1 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newClients = (cityForm.clients || []).filter((_, i) => i !== index)
                            setCityForm({...cityForm, clients: newClients})
                          }}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove Client
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setCityForm({
                      ...cityForm, 
                      clients: [...(cityForm.clients || []), { name: '', description: '', image: '', rating: 5, review: '' }]
                    })}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Client
                  </button>
                </div>
              </form>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => {
                setShowCityModal(false)
                setEditingCity(null)
                setCityForm({
                  _id: '',
                  slug: '',
                  name: '',
                  state: '',
                  population: '',
                  avgHomePrice: '',
                  heroImage: '',
                  shortDescription: '',
                  tags: '',
                  neighborhoods: [''],
                  highlights: [''],
                  faqs: [{ question: '', answer: '', category: 'Travel' }],
                  fullDescription: ''
                })
              }} className="btn btn-secondary">Cancel</button>
              <button type="button" onClick={() => {
                if (editingCity) {
                  updateCity(cityForm)
                } else {
                  createCity(cityForm)
                }
              }} className="btn btn-primary">{editingCity ? 'Update City' : 'Save City'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}