"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { HeroContentManager } from "@/components/admin/hero-content-manager"
import { BlogManager } from "@/components/admin/blog-manager"
import { UserManager } from "@/components/admin/user-manager"
import { CityManager } from "@/components/admin/city-manager"

const NAV_ITEMS = [
  { key: "users", label: "Users" },
  { key: "hero", label: "Hero Content" },
  { key: "blogs", label: "Blogs" },
  { key: "cities", label: "Cities" },
]

export default function AdminDashboard() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("users")
  const router = useRouter()

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
          // Fallback to a default email if not stored
          setUser({ email: "admin@example.com" })
        }
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader user={user} />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-full flex flex-col py-8 px-4">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                className={`text-left px-4 py-2 rounded font-medium transition-colors ${
                  activeSection === item.key
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => setActiveSection(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeSection === "users" && <UserManager />}
          {activeSection === "hero" && <HeroContentManager />}
          {activeSection === "blogs" && <BlogManager />}
          {activeSection === "cities" && <CityManager />}
        </main>
      </div>
    </div>
  )
}