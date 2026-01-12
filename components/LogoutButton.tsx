"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
    >
      LOGOUT
    </button>
  );
}
