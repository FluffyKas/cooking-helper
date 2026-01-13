"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function LogoutButton() {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <Button onClick={handleLogout}>LOGOUT</Button>
  );
}
