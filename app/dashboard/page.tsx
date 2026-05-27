'use client'

import { useEffect, useState } from 'react'
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
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import { getSupabase } from "@/lib/supabase"

interface Project {
  id: string
  name: string
  status: string
  location?: string
  expenses?: string
  budget?: string
  progress?: number
  labor?: number
  startDate?: string
  workDays?: string
}

const stats = [
  { label: "Active Projects", value: "12", trend: "+2 this month", icon: BarChart3, positive: true },
  { label: "Total Workforce", value: "248", trend: "Across all sites", icon: Users, positive: null },
]

function DashboardContent() {
  const { session } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const supabase = getSupabase()
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .limit(4)

        if (!error && data) {
          const transformedProjects = data.map((project: any) => ({
            id: project.id,
            name: project.name,
            status: project.status,
            location: project.location || 'Site Location',
            expenses: project.budget_spent ? `$${(project.budget_spent / 1000).toFixed(1)}M` : '$0M',
            budget: project.budget ? `$${(project.budget / 1000).toFixed(1)}M` : '$0M',
            progress: Math.floor(Math.random() * 100),
            labor: Math.floor(Math.random() * 200),
            startDate: project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
            workDays: project.duration_days ? `${project.duration_days} Days` : 'N/A',
          }))
          setProjects(transformedProjects)
        }
      } catch (error) {
        console.error('[v0] Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <AppShell title="Command Center">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6 md:mb-8">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Operations Overview</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mt-1">
              Welcome, {session?.user.full_name?.split(' ')[0]}
            </h1>
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

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-lg">
            <p className="text-slate-500">No projects found</p>
          </div>
        ) : (
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
                      backgroundImage: `url('/placeholder.svg?height=400&width=800&query=${project.name.replace(/\s+/g, '-')}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <Badge variant={
                      project.status === 'DELAYED' ? 'destructive' :
                      project.status === 'AT RISK' ? 'warning' :
                      project.status === 'AHEAD' ? 'info' :
                      'success'
                    }>
                      {project.status}
                    </Badge>
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
                    <Progress value={project.progress} indicatorClassName="bg-slate-900" />
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
        )}
      </section>
    </AppShell>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
