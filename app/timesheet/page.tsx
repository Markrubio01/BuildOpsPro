"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Download,
  User,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DayStatus = "present" | "absent" | "ot" | "weekend" | "holiday" | null;

const daysData: Record<
  number,
  { status: DayStatus; hours: number; project: string }
> = {
  1: { status: "weekend", hours: 0, project: "" },
  2: { status: "present", hours: 8.0, project: "Core Construction" },
  3: { status: "present", hours: 8.0, project: "Core Construction" },
  4: { status: "ot", hours: 10.5, project: "Infrastructure Phase 2" },
  5: { status: "present", hours: 8.0, project: "Structural Slab" },
  6: { status: "present", hours: 8.0, project: "Structural Slab" },
  7: { status: "weekend", hours: 0, project: "" },
  8: { status: "weekend", hours: 0, project: "" },
  9: { status: "absent", hours: 0, project: "Medical Leave" },
  10: { status: "present", hours: 8.0, project: "Site Cleanup" },
  11: { status: "present", hours: 8.0, project: "Main Lobby Floor" },
  12: { status: "present", hours: 8.0, project: "Main Lobby Floor" },
  13: { status: "present", hours: 8.0, project: "Electrical Finish" },
  14: { status: "weekend", hours: 0, project: "" },
  15: { status: "weekend", hours: 0, project: "" },
  16: { status: "present", hours: 8.0, project: "Exterior Glass" },
  17: { status: "ot", hours: 9.5, project: "Exterior Glass" },
  18: { status: "present", hours: 8.0, project: "HVAC Install" },
  19: { status: "present", hours: 8.0, project: "HVAC Install" },
  20: { status: "holiday", hours: 0, project: "Company Holiday" },
  21: { status: "weekend", hours: 0, project: "" },
  22: { status: "weekend", hours: 0, project: "" },
  23: { status: "present", hours: 8.0, project: "Rooftop Sealant" },
  24: { status: "ot", hours: 11.0, project: "Rooftop Sealant" },
  25: { status: "present", hours: 8.0, project: "Inspection Prep" },
  26: { status: "present", hours: 8.0, project: "Inspection Prep" },
  27: { status: "present", hours: 8.0, project: "Compliance Review" },
  28: { status: "weekend", hours: 0, project: "" },
  29: { status: "weekend", hours: 0, project: "" },
  30: { status: "present", hours: 8.0, project: "Structural Seals" },
  31: { status: "present", hours: 8.0, project: "Structural Seals" },
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TimesheetPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(5);
  const [currentMonth, setCurrentMonth] = useState(new Date(2023, 9)); // October 2023
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // Get days in month and start offset
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay(); // 0 = Sunday, 6 = Saturday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  const stats = useMemo(() => {
    const values = Object.values(daysData);
    const total = values.reduce((s, d) => s + d.hours, 0);
    const ot = values
      .filter((d) => d.status === "ot")
      .reduce((s, d) => s + (d.hours - 8), 0);
    const workDays = values.filter((d) =>
      ["present", "ot"].includes(d.status as string),
    ).length;
    return { total, ot, workDays };
  }, []);

  return (
    <AppShell title="Timesheet">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              Attendance Log
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mt-1">
              Timesheet Management
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard
            label="Total Hours"
            value="164.5"
            trend="+4.2% last month"
            positive
          />
          <StatCard
            label="Overtime Hours"
            value={stats.ot.toFixed(1)}
            trend="Scheduled: 10.0 hrs"
          />
          <StatCard
            label="Attendance"
            value="98%"
            trend="21/22 days present"
            positive
          />
          <StatCard
            label="Project Progress"
            value="76%"
            trend="Tracking on schedule"
            highlight
          />
        </div>

        {/* Calendar */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 border-b border-slate-200 gap-3">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {currentMonth.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex items-center border border-slate-200 rounded-md">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 hover:bg-slate-50 border-l border-slate-200 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                <LegendItem
                  color="bg-emerald-100 border-emerald-200 text-emerald-700"
                  label="Present"
                />
                <LegendItem
                  color="bg-blue-100 border-blue-200 text-blue-700"
                  label="Overtime"
                />
                <LegendItem
                  color="bg-red-100 border-red-200 text-red-700"
                  label="Absent"
                />
                <LegendItem
                  color="bg-amber-100 border-amber-200 text-amber-700"
                  label="Holiday"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Select
                value={selectedEmployee || "sarah"}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger className="w-full md:w-72 h-11 bg-white">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah J. — Project Lead</SelectItem>
                  <SelectItem value="mike">Mike R. — Site Foreman</SelectItem>
                  <SelectItem value="david">
                    David K. — Structural Eng.
                  </SelectItem>
                  <SelectItem value="elena">
                    Elena M. — Safety Inspector
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Week header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {WEEKDAYS.map((day, i) => (
              <div
                key={day}
                className="py-3 text-center border-r last:border-r-0 border-slate-200"
              >
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    i >= 5 ? "text-slate-900" : "text-slate-500",
                  )}
                >
                  {day}
                </p>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {/* Pre-month empty cells */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="border-r border-b border-slate-100 p-2 md:p-3 bg-slate-50/50 min-h-[72px] md:min-h-[100px]"
              >
                <span className="text-xs text-slate-300 font-semibold">
                  {25 + i}
                </span>
              </div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const data = daysData[day];
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "border-r border-b border-slate-100 p-2 md:p-3 text-left hover:bg-slate-50 transition-colors min-h-[72px] md:min-h-[100px] relative",
                    isSelected &&
                      "ring-2 ring-slate-900 ring-inset z-10 bg-white",
                    data.status === "weekend" && "bg-slate-50/30",
                  )}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span
                      className={cn(
                        "text-sm font-bold",
                        isSelected && "text-slate-900",
                      )}
                    >
                      {day}
                    </span>
                    {data.status && data.status !== "weekend" && (
                      <DayBadge status={data.status} />
                    )}
                  </div>
                  {data.hours > 0 && (
                    <div className="mt-3 md:mt-4 space-y-0.5">
                      <p className="text-[11px] font-bold text-slate-900">
                        {data.hours.toFixed(1)} hrs
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {data.project}
                      </p>
                    </div>
                  )}
                  {data.status === "absent" && (
                    <div className="mt-3 md:mt-4">
                      <p className="text-[10px] text-slate-400 italic">
                        {data.project}
                      </p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  trend,
  positive,
  highlight,
}: {
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white p-4 md:p-6 border border-slate-200 rounded-lg",
        highlight && "border-l-4 border-l-slate-900",
      )}
    >
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-2xl md:text-3xl font-bold tracking-tight">{value}</p>
      <div
        className={cn(
          "mt-2 text-[11px] font-semibold flex items-center gap-1",
          positive ? "text-emerald-600" : "text-slate-500",
        )}
      >
        {positive && <TrendingUp className="h-3 w-3" />}
        {trend}
      </div>
    </div>
  );
}

function DayBadge({ status }: { status: DayStatus }) {
  const config = {
    present: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Present",
    },
    absent: { bg: "bg-red-100", text: "text-red-700", label: "Absent" },
    ot: { bg: "bg-blue-100", text: "text-blue-700", label: "OT" },
    holiday: { bg: "bg-amber-100", text: "text-amber-700", label: "Hol" },
    weekend: { bg: "", text: "", label: "" },
  }[status as string] || { bg: "", text: "", label: "" };
  if (!config.label) return null;
  return (
    <span
      className={cn(
        "text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
        config.bg,
        config.text,
      )}
    >
      {config.label}
    </span>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("w-3 h-3 rounded border", color)} />
      <span className="font-semibold">{label}</span>
    </div>
  );
}
