import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BuildOps Pro — Construction Management System",
  description:
    "Industrial-grade construction management platform for site managers. Real-time project oversight, crew timekeeping, and payroll processing.",
  keywords: ["construction management", "payroll", "timesheet", "site management", "BuildOps"],
}

export const viewport: Viewport = {
  themeColor: "#1b1b1d",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
