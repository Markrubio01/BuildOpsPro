import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { MobileBottomNav } from "./mobile-bottom-nav"

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar title={title} />
      <main className="lg:ml-64 pt-10 pb-20 lg:pb-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
      <MobileBottomNav />
    </div>
  )
}
