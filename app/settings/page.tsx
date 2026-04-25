"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Briefcase, Shield, Bell, KeyRound, ChevronRight, LogOut, Camera } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const sections = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
]

export default function SettingsPage() {
  const [active, setActive] = useState("personal")

  return (
    <AppShell title="Settings">
      <div className="space-y-6">
        {/* Profile header */}
        <section className="bg-white border border-slate-200 rounded-lg p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl md:text-2xl font-bold">
              MT
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50">
              <Camera className="h-3.5 w-3.5 text-slate-700" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Marcus Thorne</h1>
            <p className="text-slate-600 text-sm">Site Manager • Skyline Towers — Phase 2</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="success">OSHA 30-Hour</Badge>
              <Badge variant="success">First Aid / CPR</Badge>
              <Badge variant="warning">Renewal: 45 Days</Badge>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </section>

        {/* Desktop sidebar + content */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          <nav className="md:col-span-1 bg-white border border-slate-200 rounded-lg p-2 h-fit">
            {sections.map((s) => {
              const Icon = s.icon
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors",
                    active === s.id ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{s.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-50" />
                </button>
              )
            })}
            <div className="border-t border-slate-100 mt-2 pt-2">
              <Link
                href="/login"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Link>
            </div>
          </nav>

          <div className="md:col-span-3">
            <SettingsPanel section={active} />
          </div>
        </div>

        {/* Mobile: use tabs */}
        <Tabs defaultValue="personal" className="md:hidden">
          <TabsList className="grid grid-cols-4 w-full">
            {sections.map((s) => (
              <TabsTrigger key={s.id} value={s.id} className="text-xs">
                {s.label.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((s) => (
            <TabsContent key={s.id} value={s.id}>
              <SettingsPanel section={s.id} />
            </TabsContent>
          ))}
          <Link
            href="/login"
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200 rounded-md text-sm font-bold text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </Tabs>
      </div>
    </AppShell>
  )
}

function SettingsPanel({ section }: { section: string }) {
  if (section === "personal") return <PersonalPanel />
  if (section === "employment") return <EmploymentPanel />
  if (section === "security") return <SecurityPanel />
  if (section === "notifications") return <NotificationsPanel />
  return null
}

function FieldRow({ label, value, editable = true }: { label: string; value: string; editable?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      {editable ? (
        <Input defaultValue={value} className="h-11 bg-slate-50 border-slate-200" />
      ) : (
        <p className="text-sm font-semibold text-slate-900 h-11 flex items-center px-3 bg-slate-100 border border-slate-200 rounded-md">
          {value}
        </p>
      )}
    </div>
  )
}

function PanelWrap({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 md:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-slate-600 mt-0.5">{desc}</p>
      </div>
      {children}
    </div>
  )
}

function PersonalPanel() {
  return (
    <PanelWrap title="Personal Information" desc="Your identity and contact details on record">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldRow label="First Name" value="Marcus" />
        <FieldRow label="Last Name" value="Thorne" />
        <FieldRow label="Work Email" value="m.thorne@industrialcorp.com" />
        <FieldRow label="Phone" value="+1 (555) 412-8890" />
        <FieldRow label="Date of Birth" value="Sept 14, 1986" editable={false} />
        <FieldRow label="Emergency Contact" value="Lisa Thorne — (555) 229-0012" />
      </div>
      <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end gap-3">
        <Button variant="ghost">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </PanelWrap>
  )
}

function EmploymentPanel() {
  return (
    <div className="space-y-6">
      <PanelWrap title="Employment Details" desc="Role, tenure, and contract information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Employee ID" value="#44021" editable={false} />
          <FieldRow label="Hire Date" value="Jan 14, 2019" editable={false} />
          <FieldRow label="Role" value="Site Manager" editable={false} />
          <FieldRow label="Contract Type" value="Full-Time / Salaried" editable={false} />
          <FieldRow label="Primary Site" value="Skyline Towers — Phase 2" editable={false} />
          <FieldRow label="Supervisor" value="Diana Park (Regional Director)" editable={false} />
        </div>
      </PanelWrap>
      <PanelWrap title="Certifications & Compliance" desc="Active safety credentials and expiration tracking">
        <div className="space-y-3">
          {[
            { name: "OSHA 30-Hour Construction", status: "Active", expires: "Mar 2026", variant: "success" as const },
            { name: "First Aid / CPR / AED", status: "Active", expires: "Jul 2025", variant: "success" as const },
            { name: "Confined Space Entry", status: "Renewal Due", expires: "Sep 2024", variant: "warning" as const },
            { name: "Fall Protection Authorized", status: "Active", expires: "Jan 2026", variant: "success" as const },
          ].map((c) => (
            <div key={c.name} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-md">
              <div>
                <p className="text-sm font-bold">{c.name}</p>
                <p className="text-xs text-slate-500">Expires: {c.expires}</p>
              </div>
              <Badge variant={c.variant}>{c.status}</Badge>
            </div>
          ))}
        </div>
      </PanelWrap>
    </div>
  )
}

function SecurityPanel() {
  return (
    <div className="space-y-6">
      <PanelWrap title="Change Password" desc="Rotate your security key at minimum every 90 days">
        <div className="space-y-4 max-w-md">
          <FieldRow label="Current Password" value="" />
          <FieldRow label="New Password" value="" />
          <FieldRow label="Confirm New Password" value="" />
          <Button className="w-full md:w-auto">
            <KeyRound className="h-4 w-4" />
            Update Password
          </Button>
        </div>
      </PanelWrap>
      <PanelWrap title="Two-Factor Authentication" desc="Additional verification layer for high-privilege actions">
        <div className="space-y-3">
          <ToggleRow label="Authenticator App" desc="Use Google Authenticator or Authy for codes" checked />
          <ToggleRow label="Biometric Sign-In" desc="FaceID / TouchID on mobile devices" checked />
          <ToggleRow label="SMS Backup" desc="Receive codes via text message" />
        </div>
      </PanelWrap>
    </div>
  )
}

function NotificationsPanel() {
  return (
    <PanelWrap title="Notification Preferences" desc="Granular control over channel delivery">
      <div className="space-y-5">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Scheduling</p>
          <div className="space-y-2">
            <ToggleRow label="Shift Assignments" desc="New and changed shifts" checked />
            <ToggleRow label="Crew Clock Alerts" desc="Late arrivals and overtime" checked />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Payroll</p>
          <div className="space-y-2">
            <ToggleRow label="Pay Stub Ready" desc="When bi-weekly stubs are generated" checked />
            <ToggleRow label="Payroll Anomalies" desc="Discrepancies requiring review" checked />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Safety</p>
          <div className="space-y-2">
            <ToggleRow label="Site Incidents" desc="Real-time hazard alerts" checked />
            <ToggleRow label="Certification Expiry" desc="30 days before renewal" checked />
          </div>
        </div>
      </div>
    </PanelWrap>
  )
}

function ToggleRow({ label, desc, checked }: { label: string; desc: string; checked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 md:p-4 bg-slate-50 border border-slate-100 rounded-md">
      <div className="flex-1 min-w-0 pr-3">
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <Switch defaultChecked={checked} />
    </div>
  )
}
