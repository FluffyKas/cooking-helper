import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cooking Helper",
  description: "Your personal recipe manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
