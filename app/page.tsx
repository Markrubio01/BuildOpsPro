"use client"

import { useEffect, useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getSupabase } from "@/lib/supabase"

interface DashboardStats {
  activeProjects: number
  teamMembers: number
  hoursThisMonth: number
}

function HomeContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    teamMembers: 0,
    hoursThisMonth: 0,
  })
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    department: "",
  })

  const departments = [
    "Engineering",
    "Operations",
    "Management",
    "Safety",
    "HR",
  ]

  // Fetch dashboard stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = getSupabase()

        // Get active projects count
        const { count: projectCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")

        // Get team members count
        const { count: memberCount } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")

        // Get hours worked this month
        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        const { data: hoursData } = await supabase
          .from("timesheet_entries")
          .select("hours_worked")
          .gte("date", monthStart.toISOString().split("T")[0])
          .lte("date", monthEnd.toISOString().split("T")[0])

        const totalHours = hoursData?.reduce((sum, entry) => sum + parseFloat(entry.hours_worked), 0) || 0

        setStats({
          activeProjects: projectCount || 0,
          teamMembers: memberCount || 0,
          hoursThisMonth: Math.round(totalHours),
        })
      } catch (error) {
        console.error("[v0] Error fetching dashboard stats:", error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsModalOpen(false)
        setFormData({
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          department: "",
        })
        // Refresh stats
        const supabase = getSupabase()
        const { count } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")
        setStats((prev) => ({ ...prev, activeProjects: count || 0 }))
        alert("Project created successfully!")
      } else {
        alert("Failed to create project")
      }
    } catch (error) {
      console.error("Error creating project:", error)
      alert("Error creating project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
              Welcome to BuildOps Pro
            </h1>
            <p className="text-slate-600 mt-2">
              Manage your projects and teams efficiently
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Active Projects</p>
            <p className="text-2xl font-bold mt-2">{statsLoading ? "-" : stats.activeProjects}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Team Members</p>
            <p className="text-2xl font-bold mt-2">{statsLoading ? "-" : stats.teamMembers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Hours This Month</p>
            <p className="text-2xl font-bold mt-2">{statsLoading ? "-" : stats.hoursThisMonth}</p>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-900">
                Project Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
                maxLength={200}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
                required
                maxLength={1000}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-900">
                  Start Date
                </label>
                <Input
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-900">
                  End Date
                </label>
                <Input
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-900">
                Department
              </label>
              <Select value={formData.department} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  )
}
