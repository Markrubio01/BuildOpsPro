"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, HardHat, Clock, Wallet, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: HardHat },
  { href: "/timesheet", label: "Time", icon: Clock },
  { href: "/payroll", label: "Pay", icon: Wallet },
  { href: "/settings", label: "Profile", icon: UserCircle },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-40">
      {items.map((item) => {
        const active = pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 flex-1 h-full justify-center relative",
              active ? "text-slate-900" : "text-slate-400",
            )}
          >
            {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-slate-900 rounded-b" />}
            <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", active && "text-slate-900")}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
