"use client";

import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "px-6 py-3 border-white/60 border-2 text-white/80 font-semibold rounded-md hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white";

  const buttonStyles = `${baseStyles} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={buttonStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
    >
      {children}
    </button>
  );
}