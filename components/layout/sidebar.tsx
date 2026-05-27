"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, HardHat, Clock, Wallet, UserCircle, LifeBuoy, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: HardHat },
  { href: "/timesheet", label: "Timesheet", icon: Clock },
  { href: "/payroll", label: "Payroll", icon: Wallet },
]

const secondary = [
  { href: "/settings", label: "Settings", icon: UserCircle },
  // { href: "/help", label: "Help & Support", icon: LifeBuoy },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 border-r border-slate-200 bg-white z-40">
      <div className="p-6">
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">BuildOps Pro</h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">Site Management</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const active = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-semibold",
                active
                  ? "bg-slate-100 text-slate-900 border-r-4 border-slate-900 rounded-r-none"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Account</p>
          {secondary.map((item) => {
            const active = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-semibold",
                  active
                    ? "bg-slate-100 text-slate-900 border-r-4 border-slate-900 rounded-r-none"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">

        <div className="mt-4 flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
            MT
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">Marcus Thorne</p>
            <p className="text-xs text-slate-500">Site Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
