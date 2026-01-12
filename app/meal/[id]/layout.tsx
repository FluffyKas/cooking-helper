"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function MealDetailLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
