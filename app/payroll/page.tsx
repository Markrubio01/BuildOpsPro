"use client"

import { useState } from "react"
import { ChevronDown, FileText, Check, AlertCircle } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const members = [
  {
    id: 1,
    name: "Elena Rodriguez",
    initials: "ER",
    role: "Structural Lead • Level 4",
    netPay: 4850.42,
    baseHours: 80,
    otHours: 12,
    absentDays: 0,
    rate: 48,
    basePay: 3840,
    otPay: 864,
    deductions: 241.58,
  },
  { id: 2, name: "James Wilson", initials: "JW", role: "Heavy Equipment Op.", netPay: 4120, baseHours: 80, otHours: 8, absentDays: 0, rate: 42, basePay: 3360, otPay: 504, deductions: 256 },
  { id: 3, name: "Sarah Chen", initials: "SC", role: "Electrical Specialist", netPay: 3950.15, baseHours: 80, otHours: 6, absentDays: 0, rate: 40, basePay: 3200, otPay: 360, deductions: 390.85 },
  { id: 4, name: "David Miller", initials: "DM", role: "Finishing Carpentry", netPay: 3680, baseHours: 80, otHours: 5, absentDays: 1, rate: 38, basePay: 3040, otPay: 285, deductions: 355 },
  { id: 5, name: "Aisha Patel", initials: "AP", role: "Safety Inspector", netPay: 3420, baseHours: 80, otHours: 0, absentDays: 0, rate: 36, basePay: 2880, otPay: 0, deductions: 220 },
]

export default function PayrollPage() {
  const [selected, setSelected] = useState(0)
  const [stubStatus, setStubStatus] = useState<"idle" | "generating" | "success" | "error">("idle")
  const member = members[selected]

  const generateStub = () => {
    setStubStatus("generating")
    setTimeout(() => setStubStatus(Math.random() > 0.3 ? "success" : "error"), 1500)
  }

  return (
    <AppShell title="Payroll">
      <div className="space-y-6">
        {/* Header with project selector + period total */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 bg-white p-5 md:p-6 border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Project</span>
            <div className="flex items-center justify-between gap-3 mt-2">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Riverside Commercial Complex</h2>
              <Button variant="outline" size="sm">
                Change <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 md:gap-12">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Period</p>
                <p className="text-sm font-semibold mt-1">Oct 01 — Oct 15, 2023</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Crew</p>
                <p className="text-sm font-semibold mt-1">42 Members</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider mt-1">
                  Processing
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 text-white p-5 md:p-6 border border-slate-900 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Total Period Expenses
              </span>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">$142,580.00</h3>
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">Budget Utilization</span>
                  <span className="font-bold">68%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: "68%" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
          {/* Crew list */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg md:text-xl font-bold tracking-tight">Crew Members</h3>
              <span className="text-xs text-slate-500 font-medium">Sorted by Net Pay</span>
            </div>
            {members.map((m, i) => {
              const isSelected = i === selected
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "w-full text-left bg-white border rounded-lg p-3 md:p-4 flex items-center gap-4 transition-all",
                    isSelected
                      ? "border-slate-950 border-2 shadow-md"
                      : "border-slate-200 hover:border-slate-400",
                  )}
                >
                  <div
                    className={cn(
                      "w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                      isSelected ? "bg-slate-950 text-white" : "bg-slate-200 text-slate-600",
                    )}
                  >
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{m.name}</p>
                      <p className="text-xs text-slate-500 truncate">{m.role}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={cn("font-bold text-base md:text-lg tracking-tight", isSelected ? "text-slate-950" : "text-slate-600")}>
                        ${m.netPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Pay</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Pay detail */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-5 md:p-6 border-b border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-bold tracking-tight">Pay Detail</h3>
                  <span className="text-[10px] font-bold text-slate-400 tracking-tight">ID: #BOP-{88219 + member.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <MetricBlock label="Total Hours" value={(member.baseHours + member.otHours).toFixed(1)} />
                  <MetricBlock label="OT Hours" value={member.otHours.toFixed(1)} />
                  <MetricBlock label="Absent Days" value={member.absentDays.toString()} tone={member.absentDays > 0 ? "error" : undefined} />
                  <MetricBlock label="Hourly Rate" value={`$${member.rate}.00`} />
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Calculations
                  </p>
                  <CalcRow label={`Base Pay (${member.baseHours}h)`} value={`$${member.basePay.toFixed(2)}`} />
                  <CalcRow label="Overtime (1.5x)" value={`$${member.otPay.toFixed(2)}`} />
                  <CalcRow label="Deductions (Tax/Ins)" value={`-$${member.deductions.toFixed(2)}`} negative />
                  <div className="flex justify-between pt-4 border-t-2 border-slate-950">
                    <span className="font-bold">Net Take-Home</span>
                    <span className="text-xl font-bold tracking-tight">
                      ${member.netPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <Button onClick={generateStub} size="lg" className="w-full h-12" disabled={stubStatus === "generating"}>
                  <FileText className="h-4 w-4" />
                  {stubStatus === "generating" ? "Generating..." : "Generate PDF Pay Stub"}
                </Button>

                {stubStatus === "success" && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Pay stub generated successfully</p>
                      <p className="text-[11px] text-emerald-700">Sent to {member.name.toLowerCase().replace(" ", ".")}@buildops.pro</p>
                    </div>
                  </div>
                )}
                {stubStatus === "error" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-900">Generation failed — server timeout</p>
                      <button onClick={generateStub} className="text-[11px] text-red-700 underline font-semibold">
                        Retry now
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest">
                  Last modified 09:42 AM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function MetricBlock({ label, value, tone }: { label: string; value: string; tone?: "error" }) {
  return (
    <div className="p-3 bg-slate-50 rounded border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={cn("text-xl md:text-2xl font-bold tracking-tight mt-1", tone === "error" ? "text-red-600" : "text-slate-900")}>
        {value}
      </p>
    </div>
  )
}

function CalcRow({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={cn("font-semibold", negative ? "text-red-600" : "text-slate-900")}>{value}</span>
    </div>
  )
}
