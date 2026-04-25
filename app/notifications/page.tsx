import { Bell, AlertTriangle, Check, Clock, Wallet, Shield } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const notifications = [
  {
    id: 1,
    icon: AlertTriangle,
    iconColor: "text-red-600 bg-red-50",
    title: "Safety incident reported at Skyline Towers",
    time: "3 minutes ago",
    unread: true,
    category: "safety",
  },
  {
    id: 2,
    icon: Clock,
    iconColor: "text-amber-600 bg-amber-50",
    title: "James Sullivan logged 2.5 hours of overtime",
    time: "24 minutes ago",
    unread: true,
    category: "timekeeping",
  },
  {
    id: 3,
    icon: Wallet,
    iconColor: "text-emerald-600 bg-emerald-50",
    title: "Pay stubs for Oct 1–15 period are ready for review",
    time: "2 hours ago",
    unread: false,
    category: "payroll",
  },
  {
    id: 4,
    icon: Shield,
    iconColor: "text-blue-600 bg-blue-50",
    title: "OSHA 30-Hour renewal due in 45 days",
    time: "Yesterday",
    unread: false,
    category: "compliance",
  },
  {
    id: 5,
    icon: Check,
    iconColor: "text-emerald-600 bg-emerald-50",
    title: "Phase 2 slab pour completed on schedule",
    time: "2 days ago",
    unread: false,
    category: "project",
  },
]

export default function NotificationsPage() {
  return (
    <AppShell title="Notifications">
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Activity Stream</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">Notifications</h1>
            <p className="text-slate-600 text-sm mt-1">2 unread • Synced just now</p>
          </div>
          <Button variant="outline" size="sm">
            Mark all read
          </Button>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
          {notifications.map((n) => {
            const Icon = n.icon
            return (
              <div
                key={n.id}
                className={`p-4 md:p-5 flex items-start gap-4 ${n.unread ? "bg-slate-50/50" : ""}`}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${n.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-semibold text-slate-900">{n.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-500">{n.time}</span>
                    <Badge variant="outline" className="text-[9px]">
                      {n.category}
                    </Badge>
                  </div>
                </div>
                {n.unread && <span className="w-2 h-2 bg-slate-900 rounded-full mt-2" />}
              </div>
            )
          })}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex items-center gap-4">
          <Bell className="h-6 w-6 text-slate-400" />
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">Get notifications faster</p>
            <p className="text-xs text-slate-600">Enable push notifications for safety-critical alerts and shift changes.</p>
          </div>
          <Button variant="outline" size="sm">
            Enable
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
