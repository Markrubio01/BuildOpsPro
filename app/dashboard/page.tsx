import Link from "next/link"
import {
  TrendingUp,
  Users,
  BarChart3,
  DollarSign,
  Download,
  Plus,
  MapPin,
  ArrowRight,
  Grid3x3,
  List,
  AlertTriangle,
} from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const stats = [
  { label: "Active Projects", value: "12", trend: "+2 this month", icon: BarChart3, positive: true },
  { label: "Total Workforce", value: "248", trend: "Across all sites", icon: Users, positive: null },
]

const projects = [
  {
    id: 1,
    name: "Skyline Heights Residency",
    location: "1240 Market St, San Francisco",
    status: "ON TRACK",
    statusVariant: "success" as const,
    expenses: "$1.2M",
    budget: "$1.8M",
    labor: 86,
    progress: 68,
    startDate: "Jan 12, 2024",
    workDays: "142 Days",
    progressClass: "bg-slate-900",
    image: "construction-skyscraper-sunset",
  },
  {
    id: 2,
    name: "West River Interchange",
    location: "Highway 101, Port District",
    status: "AT RISK",
    statusVariant: "warning" as const,
    expenses: "$4.5M",
    budget: "$5.2M",
    labor: 142,
    progress: 88,
    startDate: "Oct 05, 2023",
    workDays: "210 Days",
    progressClass: "bg-amber-500",
    image: "highway-construction-excavator",
  },
  {
    id: 3,
    name: "Nexus Plaza Retail",
    location: "4200 Commerce Blvd, Oakland",
    status: "AHEAD",
    statusVariant: "info" as const,
    expenses: "$680K",
    budget: "$1.4M",
    labor: 48,
    progress: 42,
    startDate: "Mar 03, 2024",
    workDays: "88 Days",
    progressClass: "bg-slate-900",
    image: "retail-plaza-construction",
  },
  {
    id: 4,
    name: "Riverside Commercial Complex",
    location: "Dockside Ave, Port District",
    status: "DELAYED",
    statusVariant: "destructive" as const,
    expenses: "$2.1M",
    budget: "$2.0M",
    labor: 64,
    progress: 92,
    startDate: "Jun 18, 2023",
    workDays: "268 Days",
    progressClass: "bg-red-500",
    image: "commercial-complex-riverside",
  },
]

export default function DashboardPage() {
  return (
    <AppShell title="Command Center">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6 md:mb-8">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Operations Overview</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mt-1">Command Center</h1>
            <p className="text-slate-600 text-sm md:text-base mt-1">
              Real-time oversight of construction lifecycle and workforce allocation.
            </p>
          </div>
          <div className="flex gap-3">

            <Button size="default" className="h-10">
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white border border-slate-200 p-4 md:p-6 rounded-lg precision-shadow">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                  <Icon className="h-4 w-4 md:h-5 md:w-5 text-slate-900" strokeWidth={2} />
                </div>
                <div className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</div>
                <div
                  className={`text-xs font-bold mt-1 flex items-center gap-1 ${
                    stat.positive === true ? "text-emerald-600" : "text-slate-500"
                  }`}
                >
                  {stat.positive === true && <TrendingUp className="h-3 w-3" />}
                  <span>{stat.trend}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Project Portfolio</h2>
            <p className="text-slate-500 text-sm mt-0.5">Showing {projects.length} active projects</p>
          </div>

        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects?id=${project.id}`}
              className="group bg-white border border-slate-200 rounded-lg precision-shadow overflow-hidden flex flex-col"
            >
              <div className="h-40 md:h-48 relative bg-slate-900">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage: `url('/placeholder.svg?height=400&width=800&query=${project.image}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge variant={project.statusVariant}>{project.status}</Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <h3 className="text-white text-lg md:text-xl font-bold tracking-tight">{project.name}</h3>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {project.location}
                  </p>
                </div>
              </div>
              <div className="p-4 md:p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expenses</p>
                    <p className="text-lg font-bold">{project.expenses}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                    <p className="text-lg font-bold">{project.budget}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Labor</p>
                    <p className="text-lg font-bold">{project.labor}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</p>
                    <p className="text-sm font-bold">{project.progress}%</p>
                  </div>
                  <Progress value={project.progress} indicatorClassName={project.progressClass} />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Start Date</p>
                    <p className="text-sm font-semibold text-slate-700">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Work Days</p>
                    <p className="text-sm font-semibold text-slate-700">{project.workDays}</p>
                  </div>
                  <div className="flex justify-end items-center">
                    <div className="h-9 w-9 flex items-center justify-center border border-slate-200 rounded-md group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
