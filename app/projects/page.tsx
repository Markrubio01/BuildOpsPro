"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  LogIn,
  LogOut,
  X,
  ChevronDown,
  UserCheck,
  TimerOff,
  XCircle,
  Building2,
  Users,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getSupabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CrewMember {
  id: string;
  name: string;
  role: string;
  time?: string;
  location?: string;
  status?: string;
  scheduled?: string;
  avatar?: string | null;
}

// Sample crew data matching the design
const sampleClockIn: CrewMember[] = [
  {
    id: "1",
    name: "David Chen",
    role: "Lead Structural Engineer",
    time: "07:15 AM",
    location: "Gate 4 Entry",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVpvL6ptLR5DMHKyrS2pGJz7gzK_07Gquv8WvLZcromnG1rq3pwLM323DCMWwhHcv-VV9T-CsfJ1oYa2xDBdYHPpA7srhlKlvT1TOOm1gq2zu5NHS6yFReg25pDKDu6TT6sa2CCpEX4IWqFSghshBkJvygiDyGBjJi6wNYaTLzjA-OuwLdgagnzkTMOLzr2sDQELLEaJZoM1uP9sFf1CCbytiLEyBRChHJDkj1lpOXdsMk3TTPE_ezJ_swA2G7IiKf6O7R4vnHNkkE",
  },
];

const sampleClockOut: CrewMember[] = [
  {
    id: "4",
    name: "Elena Rodriguez",
    role: "Site Architect",
    time: "04:30 PM",
    status: "Shift Ended",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDb_sBJfJD7aidNJ2e4z3SBIvGGze-BmseJ9SyUjNFGJsxSnq5t_wSGtE_gjegJsp1Zja7FSTzPnn3vCupd0xWIuZnGWF3igAxNPNmLESpHQgSp1uYJeEJNBu3zqNBy140aeUDcT3yUzEKANoBef6up4P1XNDzm7VLaGXMY-2SqGflmZ3ou0vPS8EIjDQIaR253qYHLOsWaZDPLWq8A2Jy7dSOTKiVuI_KgLSDDFRUVYZb48eobWzAzqCpa3xy_F-KcjeUYhOOm9TMJ",
  },
];

const sampleAbsent: CrewMember[] = [
  {
    id: "6",
    name: "Robert Vance",
    role: "Lead Electrician",
    status: "No Show",
    scheduled: "08:00 AM",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmQ4UxxEgbnGWNpA2P6Wr7QMrdQcmuGCGJS_tUFCiPD2rbzaTGdO4e30pb43NJPVgLZXkgDUTHqyPLULwvxe24JZeEEKt-vSlAkwtXMT_gDfRejgtDBYCsWfBEN8JbZGkOxAMSvpBtzcqxyxIRgx2EWhigGQB-9NKSP5wdL0gH5O2vUa9nwBc257EBYFs2vvuVYS_qtBdo8ZnPh6BX2zzY8CmW7Miqi0FARXGrkyPTe6WgI2HtWfi2UGTdtKgSg-RH3bUBXaehJ4vc",
  },
];

// Personnel available to clock in/out
const availablePersonnel = [
  {
    id: "p1",
    name: "Elena Vance",
    role: "HVAC Specialist",
    time: "04:30 PM",
    shiftStatus: "FULL SHIFT",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDb_sBJfJD7aidNJ2e4z3SBIvGGze-BmseJ9SyUjNFGJsxSnq5t_wSGtE_gjegJsp1Zja7FSTzPnn3vCupd0xWIuZnGWF3igAxNPNmLESpHQgSp1uYJeEJNBu3zqNBy140aeUDcT3yUzEKANoBef6up4P1XNDzm7VLaGXMY-2SqGflmZ3ou0vPS8EIjDQIaR253qYHLOsWaZDPLWq8A2Jy7dSOTKiVuI_KgLSDDFRUVYZb48eobWzAzqCpa3xy_F-KcjeUYhOOm9TMJ",
  },
  {
    id: "p2",
    name: "David Aris",
    role: "Steel Fixer",
    time: "04:30 PM",
    shiftStatus: "NEAR END",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVpvL6ptLR5DMHKyrS2pGJz7gzK_07Gquv8WvLZcromnG1rq3pwLM323DCMWwhHcv-VV9T-CsfJ1oYa2xDBdYHPpA7srhlKlvT1TOOm1gq2zu5NHS6yFReg25pDKDu6TT6sa2CCpEX4IWqFSghshBkJvygiDyGBjJi6wNYaTLzjA-OuwLdgagnzkTMOLzr2sDQELLEaJZoM1uP9sFf1CCbytiLEyBRChHJDkj1lpOXdsMk3TTPE_ezJ_swA2G7IiKf6O7R4vnHNkkE",
  },
  {
    id: "p3",
    name: "Jordan Lee",
    role: "Carpenter",
    time: "04:30 PM",
    shiftStatus: "FULL SHIFT",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLUz6nSnFGc7-HJQUSYLOyfC4vX0mrJmHDN4gebC2hLcKCNk_Lm5SrjaivSsta7j6ubgP_mfe1vL0y-pd3LPNyODV-hbe8AP-XEwRVAJXj67V616SF-eCLJT7A_ay-URJYLlzXYqAll2VDQA5__BHYgyaC5BistmahkYNxOaTAnBjwBUqnMTJhsbdgLNIhB8hLywviU4ov-wqKwlANMfgdZn0-GuQYjbJuUvGh-Tr8fL0tVJaUf3LlC1KcYy3R9FY2K7gf9TYAmQQU",
  },
  {
    id: "p4",
    name: "Samuel Park",
    role: "Safety Officer",
    time: "04:30 PM",
    shiftStatus: "OVERTIME",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAx4wa7b-5D0c3w48q0oYJwOxT1eX4qWebusJLtMHo-jdKhiWJexQspdMwOEpLEBhn9gwb1Tu7pa7De7SHuzkjxQfiOxKCHkZwow6SaL_slGQvLks3TIOlWxJT6N6Dyy6PXqIqfXzY9fAX3gvKAz2h0fInJqMgSS3wMmQr47T1Nl0B-suhJUG05UOsucgjWjetdWW2DLi9CuW3vQoU49ZsHHC4S7v1VT7lZ6TGjtGLliV6FEukKhEC-aoGt-oRQ8MngN3kHZKazsTaM",
  },
];

const unclockdPersonnel = [
  {
    id: "u1",
    name: "Riley Smith",
    role: "Carpenter",
    timeIn: "07:30 AM",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLUz6nSnFGc7-HJQUSYLOyfC4vX0mrJmHDN4gebC2hLcKCNk_Lm5SrjaivSsta7j6ubgP_mfe1vL0y-pd3LPNyODV-hbe8AP-XEwRVAJXj67V616SF-eCLJT7A_ay-URJYLlzXYqAll2VDQA5__BHYgyaC5BistmahkYNxOaTAnBjwBUqnMTJhsbdgLNIhB8hLywviU4ov-wqKwlANMfgdZn0-GuQYjbJuUvGh-Tr8fL0tVJaUf3LlC1KcYy3R9FY2K7gf9TYAmQQU",
  },
  {
    id: "u2",
    name: "Elena Rodriguez",
    role: "Structural Welder",
    timeIn: "07:30 AM",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDb_sBJfJD7aidNJ2e4z3SBIvGGze-BmseJ9SyUjNFGJsxSnq5t_wSGtE_gjegJsp1Zja7FSTzPnn3vCupd0xWIuZnGWF3igAxNPNmLESpHQgSp1uYJeEJNBu3zqNBy140aeUDcT3yUzEKANoBef6up4P1XNDzm7VLaGXMY-2SqGflmZ3ou0vPS8EIjDQIaR253qYHLOsWaZDPLWq8A2Jy7dSOTKiVuI_KgLSDDFRUVYZb48eobWzAzqCpa3xy_F-KcjeUYhOOm9TMJ",
  },
  {
    id: "u3",
    name: "James Miller",
    role: "General Laborer",
    timeIn: "07:30 AM",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAVpvL6ptLR5DMHKyrS2pGJz7gzK_07Gquv8WvLZcromnG1rq3pwLM323DCMWwhHcv-VV9T-CsfJ1oYa2xDBdYHPpA7srhlKlvT1TOOm1gq2zu5NHS6yFReg25pDKDu6TT6sa2CCpEX4IWqFSghshBkJvygiDyGBjJi6wNYaTLzjA-OuwLdgagnzkTMOLzr2sDQELLEaJZoM1uP9sFf1CCbytiLEyBRChHJDkj1lpOXdsMk3TTPE_ezJ_swA2G7IiKf6O7R4vnHNkkE",
  },
];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [clockInModalOpen, setClockInModalOpen] = useState(false);
  const [clockOutModalOpen, setClockOutModalOpen] = useState(false);
  const [selectedClockIn, setSelectedClockIn] = useState<Set<string>>(new Set());
  const [selectedClockOut, setSelectedClockOut] = useState<Set<string>>(new Set());
  const [modalSearch, setModalSearch] = useState("");
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);
  const [isClockOutModalOpen, setIsClockOutModalOpen] = useState(false);
  const [clockedInCrew, setClockdInCrew] = useState<CrewMember[]>(sampleClockIn);
  const [clockedOutCrew, setClockdOutCrew] = useState<CrewMember[]>(sampleClockOut);
  const [absentCrew, setAbsentCrew] = useState<CrewMember[]>(sampleAbsent);
  const [isLoading, setIsLoading] = useState(true);

  // Load crew data on mount
  useEffect(() => {
    const fetchClockInOutData = async () => {
      try {
        const supabase = getSupabase();

        // Get today's clock-in records
        const today = new Date().toISOString().split("T")[0];
        const { data: clockInData } = await supabase
          .from("clock_in_records")
          .select("*, users(*)")
          .eq("status", "active")
          .gte("clock_in_time", today);

        // Get today's clock-out records
        const { data: clockOutData } = await supabase
          .from("clock_in_records")
          .select("*, users(*)")
          .not("clock_out_time", "is", null)
          .gte("clock_in_time", today);

        // Transform data to match UI structure
        if (clockInData) {
          const clockInCrew = clockInData.map((record) => ({
            id: record.user_id,
            name: record.users?.full_name || "Unknown",
            role: record.users?.title || "Staff",
            time: new Date(record.clock_in_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            location: "Site Location",
          }));
          setClockdInCrew([...sampleClockIn, ...clockInCrew].slice(0, 5));
        }

        if (clockOutData) {
          const clockOutCrew = clockOutData.map((record) => ({
            id: record.user_id,
            name: record.users?.full_name || "Unknown",
            role: record.users?.title || "Staff",
            time: new Date(record.clock_out_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "Shift Ended",
          }));
          setClockdOutCrew([...sampleClockOut, ...clockOutCrew].slice(0, 5));
        }
      } catch (error) {
        console.error("[v0] Error fetching clock-in/out data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClockInOutData();
  }, []);

  const toggleClockIn = (id: string) => {
    const next = new Set(selectedClockIn);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedClockIn(next);
  };

  const toggleClockOut = (id: string) => {
    const next = new Set(selectedClockOut);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedClockOut(next);
  };

  const handleClockIn = async () => {
    if (selectedClockIn.size === 0) {
      alert("Select at least one employee to clock in");
      return;
    }

    try {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            for (const id of selectedClockIn) {
              await fetch("/api/clock-in/checkin", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
                body: JSON.stringify({
                  location_lat: position.coords.latitude,
                  location_lng: position.coords.longitude,
                  biometric_verified: false,
                  notes: "Clock in via web interface",
                }),
              });
            }
            setClockInModalOpen(false);
            setSelectedClockIn(new Set());
            alert("Successfully clocked in!");
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("Unable to get location. Please enable location services.");
          }
        );
      }
    } catch (error) {
      console.error("Error clocking in:", error);
      alert("Error clocking in employees");
    }
  };

  const handleClockOut = async () => {
    if (selectedClockOut.size === 0) {
      alert("Select at least one employee to clock out");
      return;
    }

    try {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            for (const id of selectedClockOut) {
              await fetch("/api/clock-in/checkout", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
                body: JSON.stringify({
                  location_lat: position.coords.latitude,
                  location_lng: position.coords.longitude,
                  notes: "Clock out via web interface",
                }),
              });
            }
            setClockOutModalOpen(false);
            setSelectedClockOut(new Set());
            alert("Successfully clocked out!");
          },
          (error) => {
            console.error("Geolocation error:", error);
            alert("Unable to get location. Please enable location services.");
          }
        );
      }
    } catch (error) {
      console.error("Error clocking out:", error);
      alert("Error clocking out employees");
    }
  };

  const getShiftStatusColor = (status: string) => {
    switch (status) {
      case "FULL SHIFT":
        return "text-emerald-600";
      case "NEAR END":
        return "text-amber-500";
      case "OVERTIME":
        return "text-orange-500";
      default:
        return "text-slate-500";
    }
  };

  // Filter crew based on search
  const filteredClocked = clockedInCrew.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
  );

  const filteredClockOut = clockedOutCrew.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAbsent = absentCrew.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell title="Projects">
      <div className="space-y-6 pb-32 lg:pb-8">
        {/* Mobile: Project Details Card */}
        <div className="lg:hidden mt-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mt-1">
            Project Management
          </h1>
        </div>
        <div className="lg:hidden bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-slate-700" />
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  ACTIVE PROJECT
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  Skyline Towers - Phase 2
                </p>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                PROJECT PROGRESS
              </span>
              <span className="text-lg font-bold text-slate-900">68.4%</span>
            </div>
            <Progress value={68.4} className="h-2" />
            <div className="flex items-center gap-2 mt-2 text-slate-900 font-semibold">
              <Users className="h-4 w-4" />
              <span className="text-sm">Crew: 24 / 32 active</span>
            </div>
          </div>
        </div>

        {/* Desktop: Header with stats */}
        <div className="hidden lg:block">
          <div className="">
            <div className="flex flex-col gap-4">
              <div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Dashboard
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 mt-1 mb-2">
                    Project Management
                  </h1>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-slate-700" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          ACTIVE PROJECT
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                          Skyline Towers - Phase 2
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        PROJECT PROGRESS
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        68.4%
                      </span>
                    </div>
                    <Progress value={68.4} className="h-2" />
                    <div className="flex items-center gap-2 mt-2 text-slate-900 font-semibold">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Crew: 24 / 32 active</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setClockInModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-sm transition-all active:scale-95 shadow-sm flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Clock In
                    </button>
                    <button
                      onClick={() => setClockOutModalOpen(true)}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded font-bold text-sm transition-all active:scale-95 shadow-sm flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Clock Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="flex gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    TOTAL ON-SITE
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-slate-900">
                    42
                  </p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex flex-col justify-center min-w-[240px]">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    PROJECT PROGRESS
                  </p>
                  <span className="text-sm font-bold text-slate-900">
                    68.4%
                  </span>
                </div>
                <Progress value={68.4} className="h-2" />
              </div>
            </div> */}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-white"
            />
          </div>

        </div>

        {/* Mobile: Crew count */}
        <div className="lg:hidden">
          <h2 className="text-xl font-bold text-slate-900">Project Crew (6)</h2>
        </div>

        {/* Crew Status Grid - Desktop: 3 columns, Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Clocked In Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-4 border-emerald-500 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Clocked In
                </h3>
              </div>
              <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-xs">
                {filteredClocked.length + 35} Members
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {filteredClocked.map((member) => (
                <CrewCard key={member.id} member={member} type="in" />
              ))}
            </div>
          </div>

          {/* Clocked Out Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-4 border-blue-500 pb-3">
              <div className="flex items-center gap-2">
                <TimerOff className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Clocked Out
                </h3>
              </div>
              <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full text-xs">
                {filteredClockOut.length + 2} Members
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {filteredClockOut.map((member) => (
                <CrewCard key={member.id} member={member} type="out" />
              ))}
            </div>
          </div>

          {/* Absent Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-4 border-red-500 pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-slate-900">Absent</h3>
              </div>
              <span className="bg-red-100 text-red-700 font-bold px-2.5 py-0.5 rounded-full text-xs">
                {filteredAbsent.length} Members
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {filteredAbsent.map((member) => (
                <AbsentCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-40">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 h-12"
            onClick={() => setClockInModalOpen(true)}
          >
            <LogIn className="h-5 w-5 mr-2" />
            CLOCK IN
          </Button>
          <Button
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 h-12"
            onClick={() => setClockOutModalOpen(true)}
          >
            <LogOut className="h-5 w-5 mr-2" />
            CLOCK OUT
          </Button>
        </div>
      </div>

      {/* FAB for Adding Staff - Mobile */}
      <button className="lg:hidden fixed right-4 bottom-44 w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-transform z-40">
        <UserPlus className="h-6 w-6" />
      </button>

      {/* Clock In Modal */}
      {clockInModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center px-4 pb-20 lg:p-0">
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
            onClick={() => setClockInModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl transform transition-all w-full max-w-lg">
            <div className="px-4 pt-4 pb-2 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Clock In Personnel
              </h2>
              <button
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                onClick={() => setClockInModalOpen(false)}
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search unclocked crew..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="pl-10 h-11 bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                {unclockdPersonnel.map((person) => (
                  <label
                    key={person.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                      selectedClockIn.has(person.id)
                        ? "bg-slate-900 border-slate-900"
                        : "border-slate-200 hover:bg-slate-50",
                    )}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                      {person.avatar && (
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "font-bold",
                          selectedClockIn.has(person.id)
                            ? "text-white"
                            : "text-slate-900",
                        )}
                      >
                        {person.name}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          selectedClockIn.has(person.id)
                            ? "text-slate-300"
                            : "text-slate-500",
                        )}
                      >
                        {person.role}
                      </p>
                      <p className="text-xs font-bold text-emerald-500 mt-0.5">
                        TIME IN: {person.timeIn}
                      </p>
                    </div>
                    <Checkbox
                      checked={selectedClockIn.has(person.id)}
                      onCheckedChange={() => toggleClockIn(person.id)}
                      className={cn(
                        "border-2",
                        selectedClockIn.has(person.id)
                          ? "border-white bg-white text-slate-900"
                          : "",
                      )}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-3">
              <Button
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-12"
                onClick={handleClockIn}
              >
                <LogIn className="h-5 w-5 mr-2" />
                CLOCK IN SELECTED
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 font-bold"
                onClick={() => setClockInModalOpen(false)}
              >
                CANCEL
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clock Out Modal */}
      {clockOutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center px-4 pb-20 lg:p-0">
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
            onClick={() => setClockOutModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl transform transition-all w-full max-w-lg">
            <div className="px-4 pt-4 pb-2 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 uppercase tracking-wide">
                Clock Out Personnel
              </h2>
              <button
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                onClick={() => setClockOutModalOpen(false)}
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Filter by name or role..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="pl-10 h-11 bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                {availablePersonnel.map((person) => (
                  <label
                    key={person.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                      selectedClockOut.has(person.id)
                        ? "bg-white border-slate-900 border-2"
                        : "border-slate-200 hover:bg-slate-50",
                    )}
                  >
                    <Checkbox
                      checked={selectedClockOut.has(person.id)}
                      onCheckedChange={() => toggleClockOut(person.id)}
                      className="border-2"
                    />
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                      {person.avatar && (
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{person.name}</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {person.role}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-slate-900">
                        {person.time}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-bold",
                          getShiftStatusColor(person.shiftStatus),
                        )}
                      >
                        {person.shiftStatus}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-3">
              <Button
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold h-12"
                onClick={handleClockOut}
              >
                <LogOut className="h-5 w-5 mr-2" />
                CLOCK OUT SELECTED
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 font-bold"
                onClick={() => setClockOutModalOpen(false)}
              >
                CANCEL
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

// Crew Card for Clocked In / Clocked Out
function CrewCard({
  member,
  type,
}: {
  member: {
    id: string;
    name: string;
    role: string;
    time: string;
    location?: string;
    status?: string;
    avatar: string;
  };
  type: "in" | "out";
}) {
  const isOut = type === "out";

  return (
    <div
      className={cn(
        "bg-white border p-4 rounded-lg hover:shadow-md transition-all cursor-pointer",
        isOut ? "border-blue-200" : "border-slate-200",
      )}
    >
      <div className="flex items-center gap-4">
        <img
          src={member.avatar}
          alt={member.name}
          className={cn(
            "w-12 h-12 rounded object-cover",
            isOut && "opacity-75",
          )}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 truncate">
            {member.name}
          </h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
            {member.role}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p
            className={cn(
              "text-xs font-bold",
              isOut ? "text-blue-600" : "text-emerald-600",
            )}
          >
            {member.time}
          </p>
          <p
            className={cn(
              "text-[10px]",
              isOut ? "text-blue-400" : "text-slate-500",
            )}
          >
            {member.location || member.status}
          </p>
        </div>
      </div>
    </div>
  );
}

// Absent Card
function AbsentCard({
  member,
}: {
  member: {
    id: string;
    name: string;
    role: string;
    status: string;
    scheduled: string;
    avatar: string | null;
  };
}) {
  const isNoShow = member.status === "No Show";

  return (
    <div
      className={cn(
        "bg-white border p-4 rounded-lg",
        isNoShow
          ? "border-l-4 border-l-red-500 border-red-100"
          : "border-l-4 border-l-slate-400 border-slate-200",
      )}
    >
      <div className="flex items-center gap-4">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-12 h-12 rounded object-cover grayscale"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400">
            <Users className="h-5 w-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 truncate">
            {member.name}
          </h4>
          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider truncate",
              isNoShow ? "text-red-600" : "text-slate-500",
            )}
          >
            {member.role}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p
            className={cn(
              "text-xs font-bold",
              isNoShow ? "text-red-600" : "text-slate-500",
            )}
          >
            {member.status}
          </p>
          <p className="text-[10px] text-slate-400">
            {isNoShow ? `Scheduled: ${member.scheduled}` : member.scheduled}
          </p>
        </div>
      </div>
    </div>
  );
}
