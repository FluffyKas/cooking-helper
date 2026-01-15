"use client";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-[pageIn_0.3s_ease-out]">
      {children}
    </div>
  );
}
