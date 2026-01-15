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
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-[100] px-4 py-2 bg-mint-300 text-nav-dark font-semibold rounded-xl outline-none ring-2 ring-mint-500 -translate-y-16 focus:translate-y-0 transition-transform"
      >
        Skip to content
      </a>
      {showNav && <Header />}
      <main
        id="main-content"
        className={`min-h-screen ${showNav ? "pt-0 md:pt-16 pb-20 md:pb-0" : ""}`}
      >
        {children}
      </main>
      {showNav && <BottomNav />}
    </>
  );
}
