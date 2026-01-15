"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "./AuthProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/add", label: "Add Recipe" },
  { href: "/favorites", label: "Favorites" },
];

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const nickname = user?.user_metadata?.nickname;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm hidden md:block z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <div className="flex items-center gap-8">
          <Link href="/" className="font-lora text-xl font-bold text-nav-dark">
            Cooking Helper
          </Link>

          <nav className="flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-mint-200 text-nav-dark"
                      : "text-gray-600 hover:bg-mint-50 hover:text-nav-dark"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {nickname && (
            <span className="text-sm text-gray-600">
              Hello, <span className="font-medium text-nav-dark">{nickname}</span>
            </span>
          )}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
