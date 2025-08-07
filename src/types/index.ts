// Centralized types for the admin panel

export interface User {
  _id?: string
  id?: string
  email: string
  role?: string
  createdAt: string
  status?: string
}

export interface Blog {
  _id?: string
  id?: string
  groupId?: string
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

export interface City {
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

export interface DashboardStats {
  users: number
  cities: number
  blogs: number
}

export interface HomeSection {
  id: string
  title: string
  subtitle: string
  backgroundImage?: string
  stats?: {
    number: string
    label: string
  }[]
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

export interface HomeData {
  hero: {
    badge: string
    title: string
    subtitle: string
    viewProperties: string
    contactUs: string
    scrollDown: string
    backgroundImage?: string
  }
  stats: {
    yearsExperience: string
    yearsExperienceLabel: string
    billionInSales: string
    billionInSalesLabel: string
    countriesServed: string
    countriesServedLabel: string
    clientSatisfaction: string
    clientSatisfactionLabel: string
  }
  services: {
    title: string
    subtitle: string
    propertyAcquisition: {
      title: string
      description: string
      icon: string
    }
    investmentAdvisory: {
      title: string
      description: string
      icon: string
    }
    relocationServices: {
      title: string
      description: string
      icon: string
    }
  }
  cities?: {
    title: string
    subtitle: string
  }
  blog?: {
    title: string
    subtitle: string
  }
  cta: {
    title: string
    text: string
    button: string
  }
}
