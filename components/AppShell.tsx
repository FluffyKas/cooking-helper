"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import Header from "./Header";
import BottomNav from "./BottomNav";

const publicRoutes = ["/login", "/signup"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isPublicRoute = publicRoutes.includes(pathname);
  const showNav = !loading && user && !isPublicRoute;

  return (
    <>
      {showNav && <Header />}
      <main className={`min-h-screen ${showNav ? "pt-0 md:pt-16 pb-20 md:pb-0" : ""}`}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </>
  );
}
