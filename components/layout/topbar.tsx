"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  Search,
  Bell,
  Settings,
  Menu,
  X,
  Home,
  HardHat,
  Clock,
  Wallet,
  UserCircle,
  LifeBuoy,
  Timer,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: HardHat },
  { href: "/timesheet", label: "Timesheet", icon: Clock },
  { href: "/payroll", label: "Payroll", icon: Wallet },
  { href: "/settings", label: "Settings", icon: UserCircle },
  { href: "/help", label: "Help & Support", icon: LifeBuoy },
]

export function Topbar({ title }: { title?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { session, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Get user initials
  const initials = session?.user.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center px-4 md:px-6 z-30">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden p-2 -ml-2 rounded-md hover:bg-slate-100">
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <div className="p-6 border-b border-slate-100">
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">BuildOps Pro</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Site Management</p>
            </div>
            <nav className="p-3 space-y-1">
              {navigation.map((item) => {
                const active = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-semibold",
                      active ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button
                onClick={() => {
                  handleLogout()
                  setOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <LogOut className="h-5 w-5" strokeWidth={2} />
                <span>Sign Out</span>
              </button>
            </nav>
            <div className="p-4 absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white">
              <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-md flex items-center justify-center gap-2">
                <Timer className="h-4 w-4 text-emerald-400" strokeWidth={2.5} />
                Clock In
              </button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="lg:hidden font-black uppercase tracking-tighter text-slate-900 truncate">
          {title || "BuildOps Pro"}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/settings" className="hidden md:inline-flex p-2 hover:bg-slate-100 rounded-md transition-colors">
          <Settings className="h-5 w-5 text-slate-600" />
        </Link>
        <div className="hidden md:block h-8 w-px bg-slate-200 mx-1" />
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-xs font-bold text-slate-900">{session?.user.full_name || 'User'}</p>
            <p className="text-[10px] text-slate-500">{session?.user.email || 'No email'}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-100 rounded-md transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4 text-slate-600" />
          </button>
        </div>
        <div className="md:hidden h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
          {initials}
        </div>
      </div>
    </header>
  )
}
