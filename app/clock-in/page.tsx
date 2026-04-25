"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Timer, ArrowLeft, Check, AlertCircle } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const projects = [
  { id: 1, name: "Skyline Towers — Phase 2", location: "1240 Market St", code: "SKY-002", active: true },
  { id: 2, name: "West River Interchange", location: "Highway 101, Port District", code: "WRI-001", active: true },
  { id: 3, name: "Nexus Plaza Retail", location: "4200 Commerce Blvd", code: "NEX-005", active: true },
  { id: 4, name: "Bridge Rehabilitation", location: "Bayside Crossing", code: "BRG-003", active: true },
]

export default function ClockInPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<number | null>(1)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleClockIn = () => {
    if (!selected) return
    setStatus("loading")
    setTimeout(() => setStatus(Math.random() > 0.15 ? "success" : "error"), 1200)
  }

  return (
    <AppShell title="Clock In">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest"
        >
          <ArrowLeft className="h-3 w-3" /> Back
        </button>

        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Site Check-In</span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">Select Your Project</h1>
          <p className="text-slate-600 text-sm md:text-base mt-2">
            Choose the site where you&apos;re starting your shift. Your location is verified via GPS.
          </p>
        </div>

        {/* Location check */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-emerald-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-900">Location verified</p>
            <p className="text-xs text-emerald-700">37.7749°N, 122.4194°W • ±8m accuracy</p>
          </div>
          <span className="w-2 h-2 bg-emerald-500 rounded-full ring-4 ring-emerald-500/20" />
        </div>

        {/* Projects list */}
        <div className="space-y-2">
          {projects.map((p) => {
            const isSelected = selected === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={cn(
                  "w-full text-left bg-white border rounded-lg p-4 md:p-5 flex items-center gap-4 transition-all",
                  isSelected ? "border-slate-950 border-2 shadow-md" : "border-slate-200 hover:border-slate-400",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0",
                    isSelected ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500",
                  )}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {p.location} • Code: {p.code}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <div className="sticky bottom-20 lg:bottom-0 lg:static py-3 bg-background">
          <Button
            size="lg"
            onClick={handleClockIn}
            className="w-full h-14 text-base"
            disabled={!selected || status === "loading"}
          >
            <Timer className="h-5 w-5" />
            {status === "loading" ? "Clocking In..." : "Clock In Now"}
          </Button>
          {status === "success" && (
            <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-md flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="font-bold text-emerald-900">Clocked in successfully</p>
                <p className="text-xs text-emerald-700">Shift started at {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          )}
          {status === "error" && (
            <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Clock-in failed</p>
                <p className="text-xs text-red-700 mb-2">Network timeout. Your time will sync when connection is restored.</p>
                <button onClick={handleClockIn} className="text-xs font-bold text-red-900 underline">
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
