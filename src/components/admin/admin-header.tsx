"use client";

// Update these imports as needed for your project structure
// import { Button } from "@/components/ui/button";
// import { createClientClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

interface AdminHeaderProps {
  user: any;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  // const supabase = createClientClient();

  const handleLogout = async () => {
    // await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAdminLoggedIn");
    }
    router.push("/admin/login");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <button
              className="border px-3 py-1 rounded flex items-center text-sm hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}