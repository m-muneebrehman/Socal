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
  User as UserIcon,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  Home,
  Clock
} from "lucide-react"

// Import types
import { User, Blog, City, DashboardStats, HomeSection, Toast, HomeData } from "@/types"

// Import components
import Sidebar from "@/components/admin/Sidebar"
import Header from "@/components/admin/Header"
import Dashboard from "@/components/admin/Dashboard"
import UserManager from "@/components/admin/UserManager"
import CityManager from "@/components/admin/CityManager"
import BlogManager from "@/components/admin/BlogManager"
import HomeManager from "@/components/admin/HomeManager"
import UserModal from "@/components/admin/UserModal"
import { ToastContainer } from "@/components/admin/Toast"
import AdminNavbar from "@/components/admin/AdminNavbar"
import AdminFooter from "@/components/admin/AdminFooter"

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
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>>([])
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    cities: 0,
    blogs: 0
  })
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Home data
  const [homeData, setHomeData] = useState<HomeData>({
    hero: {
      badge: 'Global Luxury Real Estate',
      title: 'Exclusive Properties for Discerning Clients',
      subtitle: 'With over 20 years of experience, we connect international buyers with the finest properties across the world\'s most desirable locations.',
      viewProperties: 'View Properties',
      contactUs: 'Contact Us',
      scrollDown: 'Scroll Down'
    },
    stats: {
      yearsExperience: '25+',
      yearsExperienceLabel: 'Years Experience',
      billionInSales: '4.2B',
      billionInSalesLabel: 'Billion in Sales',
      countriesServed: '50+',
      countriesServedLabel: 'Countries Served',
      clientSatisfaction: '100%',
      clientSatisfactionLabel: 'Client Satisfaction'
    },
    services: {
      title: 'Our Services',
      subtitle: 'Comprehensive real estate solutions tailored to your unique needs.',
      propertyAcquisition: {
        title: 'Property Acquisition',
        description: 'Our global network and market expertise ensures you find the perfect property that meets all your requirements.',
        icon: '🏡'
      },
      investmentAdvisory: {
        title: 'Investment Advisory',
        description: 'Strategic guidance to maximize returns on your real estate investments with our data-driven approach.',
        icon: '💰'
      },
      relocationServices: {
        title: 'Relocation Services',
        description: 'Comprehensive support for international clients moving to new countries, including legal and logistical assistance.',
        icon: '🌎'
      }
    },
    cities: {
      title: 'Explore California Cities',
      subtitle: 'Discover the most desirable locations across the Golden State, each offering unique lifestyle opportunities and investment potential.'
    },
    blog: {
      title: 'Latest Insights',
      subtitle: 'Discover our expert perspectives on luxury real estate markets worldwide.'
    },
    cta: {
      title: 'Ready to Find Your Dream Property?',
      text: 'Contact our team of experts today for a personalized consultation and begin your journey to finding the perfect home or investment property.',
      button: 'Schedule Consultation'
    }
  })
  
  // Form states
  const [userForm, setUserForm] = useState({ _id: '', email: '', password: '', role: '', status: '' })
  // Blog form state
  const emptyBlog: Blog = {
    _id: '',
    groupId: '',
    slug: '',
    title: '',
    subtitle: '',
    category: 'Marketing',
    author: '',
    date: '',
    status: 'Draft',
    featured: false,
    content: { lead: '' },
    views: 0,
    likes: 0
  }
  const [blogForm, setBlogForm] = useState<Blog>(emptyBlog)
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
      console.log('Fetching users...')
      const response = await fetch('/admin/api/users')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched users data:', data)
        setUsers(data)
        setFilteredUsers(data)
      } else {
        console.error('Failed to fetch users:', response.status, response.statusText)
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
        setFilteredCities(data)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const fetchStats = async () => {
    try {
      // Calculate real stats from actual data
      setStats({
        users: users.length,
        cities: cities.length,
        blogs: blogs.length
      })
    } catch (error) {
      console.error('Error calculating stats:', error)
    }
  }

  const fetchHomeData = async () => {
    try {
      const response = await fetch('/api/home')
      if (response.ok) {
        const data = await response.json()
        setHomeData(data)
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
    }
  }

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, type, message }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Function to handle adding new user
  const handleAddUser = () => {
    console.log('🔧 handleAddUser called')
    setEditingUser(null)
    setUserForm({ _id: '', email: '', password: '', role: '', status: '' })
    setShowUserModal(true)
    console.log('🔧 Form reset, modal opened')
  }

  // Function to handle adding new city
  const handleAddCity = () => {
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
    setShowCityModal(true)
  }

  // Function to handle adding new blog
  const handleAddBlog = () => {
    setEditingBlog(null)
    setBlogForm(emptyBlog)
    setShowBlogModal(true)
  }

  // Function to update home data
  const updateHomeData = async (newHomeData: HomeData) => {
    try {
      const response = await fetch('/api/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHomeData)
      })
      if (response.ok) {
        setHomeData(newHomeData)
        addToast('success', 'Home data updated successfully!')
        
        // Trigger refresh on home page by setting localStorage flag
        if (typeof window !== 'undefined') {
          localStorage.setItem('homeDataUpdated', Date.now().toString())
          // Dispatch a custom event to notify other tabs/windows
          window.dispatchEvent(new CustomEvent('homeDataUpdated'))
        }
        
        // Also refresh the home data to ensure consistency
        await fetchHomeData()
      } else {
        addToast('error', 'Failed to update home data')
      }
    } catch (error) {
      console.error('Error updating home data:', error)
      addToast('error', 'Failed to update home data')
    }
  }

  const createUser = async (userData: User) => {
    try {
      // Remove _id for new user creation to let MongoDB generate it
      const { _id, ...userDataWithoutId } = userData
      console.log('Creating user with data:', userDataWithoutId)
      const response = await fetch('/admin/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDataWithoutId)
      })
      if (response.ok) {
        const result = await response.json()
        console.log('User creation result:', result)
        await fetchUsers()
        setShowUserModal(false)
        setEditingUser(null)
        setUserForm({ _id: '', email: '', password: '', role: '', status: '' })
        console.log('🔒 Form reset after user creation')
        addToast('success', 'User created successfully!')
      } else {
        const error = await response.json()
        console.error('Server error:', error)
        addToast('error', error.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      addToast('error', 'Failed to create user')
    }
  }

  const createBlog = async (blogData: Blog) => {
    try {
      // Remove _id for new blog creation to let MongoDB generate it
      const { _id, ...blogDataWithoutId } = blogData
      
      const response = await fetch('/admin/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogDataWithoutId,
          date: new Date().toISOString(),
          featured: blogData.featured === 'Yes',
          author: blogData.author // Keep as string for new blogs
        })
      })
      if (response.ok) {
        await fetchBlogs()
        setShowBlogModal(false)
        setBlogForm(emptyBlog)
        addToast('success', 'Blog created successfully!')
      } else {
        const error = await response.json()
        addToast('error', error.error || 'Failed to create blog')
      }
    } catch (error) {
      console.error('Error creating blog:', error)
      addToast('error', 'Failed to create blog')
    }
  }

  const createCity = async (cityData: City) => {
    try {
      // Filter out empty values from arrays
      const filteredNeighborhoods = cityData.neighborhoods.filter((n: string) => n.trim() !== '')
      const filteredHighlights = cityData.highlights.filter((h: { title: string; description: string; icon: string; bgImage: string }) => 
        h && h.title && h.description && h.title.trim() !== '' && h.description.trim() !== ''
      )
      const filteredFaqs = cityData.faqs.filter((f: { question: string; answer: string; category: string }) => 
        f && f.question && f.answer && 
        f.question.trim() !== '' && f.answer.trim() !== ''
      )
      const filteredClients = cityData.clients?.filter((c: { name: string; description: string; image: string; rating: number; review: string }) => 
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
        addToast('success', 'City created successfully!')
      } else {
        const error = await response.json()
        console.error('Server error:', error)
        addToast('error', error.error || 'Failed to create city')
      }
    } catch (error) {
      console.error('Error creating city:', error)
      addToast('error', 'Failed to create city: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const deleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('Deleting user with ID:', id)
        const response = await fetch('/admin/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id, id: id })
        })
        if (response.ok) {
          await fetchUsers()
          addToast('success', 'User deleted successfully!')
        } else {
          const error = await response.json()
          console.error('Server error:', error)
          addToast('error', error.error || 'Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        addToast('error', 'Failed to delete user')
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
        addToast('success', 'Blog deleted successfully!')
      } else {
        const error = await response.json()
        addToast('error', error.error || 'Failed to delete blog')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      addToast('error', 'Failed to delete blog')
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
          addToast('success', 'City deleted successfully!')
        } else {
          const error = await response.json()
          console.error('Server error:', error)
          addToast('error', error.error || 'Failed to delete city')
        }
      } catch (error) {
        console.error('Error deleting city:', error)
        addToast('error', 'Failed to delete city: ' + (error instanceof Error ? error.message : 'Unknown error'))
      }
    }
  }

  const updateUser = async (userData: User) => {
    try {
      console.log('Updating user with data:', userData)
      const response = await fetch('/admin/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      if (response.ok) {
        await fetchUsers()
        setShowUserModal(false)
        setEditingUser(null)
        setUserForm({ _id: '', email: '', password: '', role: '', status: '' })
        addToast('success', 'User updated successfully!')
      } else {
        const error = await response.json()
        console.error('Server error:', error)
        addToast('error', error.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      addToast('error', 'Failed to update user')
    }
  }

  const updateBlog = async (blogData: Blog) => {
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
        setBlogForm(emptyBlog)
        addToast('success', 'Blog updated successfully!')
      } else {
        const error = await response.json()
        addToast('error', error.error || 'Failed to update blog')
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      addToast('error', 'Failed to update blog')
    }
  }

  const updateCity = async (cityData: City) => {
    try {
      // Filter out empty values from arrays
      const filteredNeighborhoods = cityData.neighborhoods.filter((n: string) => n.trim() !== '')
      const filteredHighlights = cityData.highlights.filter((h: { title: string; description: string; icon: string; bgImage: string }) => 
        h && h.title && h.description && h.title.trim() !== '' && h.description.trim() !== ''
      )
      const filteredFaqs = cityData.faqs.filter((f: { question: string; answer: string; category: string }) => 
        f && f.question && f.answer && 
        f.question.trim() !== '' && f.answer.trim() !== ''
      )
      const filteredClients = cityData.clients?.filter((c: { name: string; description: string; image: string; rating: number; review: string }) => 
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
        addToast('success', 'City updated successfully!')
      } else {
        const error = await response.json()
        console.error('Server error:', error)
        addToast('error', error.error || 'Failed to update city')
      }
    } catch (error) {
      console.error('Error updating city:', error)
      addToast('error', 'Failed to update city: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
      Promise.all([fetchUsers(), fetchBlogs(), fetchCities(), fetchStats(), fetchHomeData()])
        .finally(() => setLoadingData(false))
    }
  }, [user])

  // Filter data based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCities(cities)
      setFilteredUsers(users)
    } else {
      // Filter cities
      const filteredCities = cities.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredCities(filteredCities)

      // Filter users
      const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.status?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredUsers(filteredUsers)
    }
  }, [searchQuery, cities, users])

  // Recalculate stats whenever data changes
  useEffect(() => {
    fetchStats()
  }, [users, cities, blogs])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAdminLoggedIn")
      localStorage.removeItem("adminUserEmail")
    }
    router.push("/admin/login")
  }

  const handleUpdateJson = async () => {
    try {
      const response = await fetch('/admin/api/update-json', { method: 'POST' })
      if (response.ok) {
        setLastUpdated(new Date().toLocaleString())
        addToast('success', 'JSON files updated successfully')
      }
    } catch (error) {
      console.error('Error updating JSON files:', error)
      addToast('error', 'Failed to update JSON files')
    }
  }

  const handleRefreshData = async () => {
    try {
      // Refresh all data
      await Promise.all([
        fetchUsers(),
        fetchBlogs(),
        fetchCities(),
        fetchStats(),
        fetchHomeData()
      ])
      setLastUpdated(new Date().toLocaleString())
      addToast('success', 'Data refreshed successfully')
    } catch (error) {
      console.error('Error refreshing data:', error)
      addToast('error', 'Failed to refresh data')
    }
  }

  const getPageInfo = () => {
    switch(activeSection) {
      case "dashboard":
        return { title: "Dashboard Overview", subtitle: "Welcome back! Here's what's happening." }
      case "home":
        return { title: "Home Page Management", subtitle: "Manage your website's main landing page" }
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
    <div className="admin-dashboard" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <Sidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Main Content Area */}
        <div className={`admin-main-content ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          {/* Global Admin Navbar */}
          <AdminNavbar 
            onLogout={handleLogout}
            onSectionChange={setActiveSection}
            activeSection={activeSection}
          />

          {/* Content */}
          <main className="admin-content" style={{ flex: 1, padding: '24px' }}>
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <Dashboard stats={stats} users={users} blogs={blogs} />
          )}

          {/* Home Section */}
          {activeSection === "home" && (
            <HomeManager 
              homeData={homeData}
              updateHomeData={updateHomeData}
            />
          )}

          {/* Users Section */}
          {activeSection === "users" && (
            <UserManager 
              users={filteredUsers}
              setShowUserModal={setShowUserModal}
              setEditingUser={setEditingUser}
              setUserForm={setUserForm}
              deleteUser={deleteUser}
              handleAddUser={handleAddUser}
            />
          )}

          {/* Cities Section */}
          {activeSection === "cities" && (
            <CityManager 
              cities={filteredCities}
              setShowCityModal={setShowCityModal}
              setEditingCity={setEditingCity}
              setCityForm={setCityForm}
              deleteCity={deleteCity}
              handleAddCity={handleAddCity}
            />
          )}

                    {/* Blogs Section */}
          {activeSection === "blogs" && (
            <BlogManager 
              blogs={blogs}
              setShowBlogModal={setShowBlogModal}
              setEditingBlog={setEditingBlog}
              setBlogForm={(form: Blog) => setBlogForm(form)}
              deleteBlog={deleteBlog}
              handleAddBlog={handleAddBlog}
            />
          )}
        </main>

          {/* Global Admin Footer */}
          <AdminFooter 
            onUpdateJson={handleUpdateJson}
            onRefreshData={handleRefreshData}
            lastUpdated={lastUpdated}
          />
        </div>

      {/* User Modal */}
      <UserModal 
        showUserModal={showUserModal}
        setShowUserModal={setShowUserModal}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        userForm={userForm}
        setUserForm={setUserForm}
        createUser={createUser}
        updateUser={updateUser}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Blog Modal */}
      {showBlogModal && (
        <div className="modal show" onClick={() => setShowBlogModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingBlog ? 'Edit Blog' : 'Add Blog'}</h2>
              <button onClick={() => {
                setShowBlogModal(false)
                setEditingBlog(null)
                setBlogForm(emptyBlog)
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
                      value={typeof blogForm.author === 'string' ? blogForm.author : (blogForm.author?.name || '')}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
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
                      value={blogForm.featured ? 'Yes' : 'No'}
                      onChange={(e) => setBlogForm({ ...blogForm, featured: e.target.value === 'Yes' })}
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Group ID <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Enter group ID (e.g. group-1)"
                      value={blogForm.groupId}
                      onChange={(e) => setBlogForm({...blogForm, groupId: e.target.value})}
                      required
                    />
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
                setBlogForm(emptyBlog)
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
                    value={Array.isArray(cityForm.tags) ? cityForm.tags.join(', ') : cityForm.tags}
                    onChange={(e) => setCityForm({ ...cityForm, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '') })}
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
                          className="btn-remove"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setCityForm({...cityForm, neighborhoods: [...cityForm.neighborhoods, '']})}
                    className="btn-add btn-add-neighborhood"
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
                          className="btn-remove"
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
                    className="btn-add btn-add-highlight"
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
                          className="btn-remove"
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
                    className="btn-add btn-add-faq"
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
                          className="btn-remove"
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
                    className="btn-add btn-add-client"
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
                  tags: [],
                  neighborhoods: [''],
                  highlights: [{ title: '', description: '', icon: '', bgImage: '' }],
                  faqs: [{ question: '', answer: '', category: 'Neighborhoods' }],
                  fullDescription: '',
                  clients: [{ name: '', description: '', image: '', rating: 5, review: '' }]
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