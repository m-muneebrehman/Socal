"use client";
import { usePathname } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/common/LoadingScreen";

export default function AdminAwareLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");
  return (
    <>
      {!isAdmin && <LoadingScreen />}
      {!isAdmin && <Navigation />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}