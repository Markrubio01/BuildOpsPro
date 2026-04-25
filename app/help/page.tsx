"use client"

import { useState } from "react"
import { Search, MessageSquare, Book, Shield, Phone, Mail, Clock, ChevronDown } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "How do I clock in/out a whole crew at once?",
    a: "Go to Projects → select your site, then use the checkboxes in the crew table to multi-select workers. The floating bulk action bar will appear — tap Clock In or Clock Out to apply the action to all selected members at once.",
  },
  {
    q: "How is overtime calculated?",
    a: "Any hours logged beyond 8.0 per day are automatically flagged as overtime and paid at 1.5x the base hourly rate. Site managers can override daily logs in the Timesheet view before payroll processing.",
  },
  {
    q: "Why can't I see the Payroll tab?",
    a: "Payroll is gated by role-based access controls. Only Site Managers, Payroll Admins, and Regional Directors have visibility. Contact your supervisor to request elevated permissions via the Access Portal.",
  },
  {
    q: "How do I generate a digital pay stub?",
    a: "Navigate to Payroll, select a crew member from the list, then tap Generate PDF Pay Stub in the detail panel. Stubs are delivered to the worker's registered email within 60 seconds.",
  },
  {
    q: "What if biometric sign-in fails?",
    a: "After 3 failed biometric attempts, you'll be prompted to fall back to password authentication. If the issue persists, contact IT via the support form below.",
  },
]

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0)
  const [query, setQuery] = useState("")
  const filtered = faqs.filter(
    (f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <AppShell title="Help & Support">
      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-slate-950 text-white rounded-lg p-6 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Knowledge Base</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 mb-3">How can we help you today?</h1>
            <p className="text-slate-300 text-sm md:text-base mb-6">
              Search the knowledge base, review FAQs, or contact our 24/7 site support team.
            </p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, FAQs, or commands..."
                className="h-12 pl-12 bg-white text-slate-900 border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickCard icon={Book} title="Documentation" desc="User guides, API references, and operations manual" />
          <QuickCard icon={MessageSquare} title="Live Chat" desc="Talk to a support specialist now (Mon–Fri, 6am–10pm PST)" />
          <QuickCard icon={Shield} title="Site Security" desc="Report security incidents or suspicious activity immediately" />
        </div>

        {/* FAQs */}
        <section className="bg-white border border-slate-200 rounded-lg p-5 md:p-6">
          <h2 className="text-xl font-bold tracking-tight mb-1">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-600 mb-5">
            Showing {filtered.length} of {faqs.length} articles
          </p>
          <div className="space-y-2">
            {filtered.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-slate-50"
                >
                  <span className="text-sm md:text-base font-bold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 text-slate-400 transition-transform flex-shrink-0", open === i && "rotate-180")}
                  />
                </button>
                {open === i && (
                  <div className="px-4 pb-4 text-sm text-slate-600 border-t border-slate-100 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ContactCard icon={Phone} label="24/7 Hotline" value="+1 (800) 551-2400" />
          <ContactCard icon={Mail} label="Email Support" value="support@buildops.pro" />
          <ContactCard icon={Clock} label="Average Response" value="Under 12 minutes" />
        </section>

        {/* Submit ticket */}
        <section className="bg-white border border-slate-200 rounded-lg p-5 md:p-6">
          <h2 className="text-xl font-bold tracking-tight mb-1">Submit a Support Ticket</h2>
          <p className="text-sm text-slate-600 mb-5">
            Describe your issue in detail. A specialist will reply within one business hour.
          </p>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-900 block">Subject</label>
                <Input placeholder="Briefly describe the issue" className="h-11 bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-900 block">Priority</label>
                <select className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-sm font-semibold">
                  <option>Standard</option>
                  <option>High</option>
                  <option>Urgent — Safety Critical</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-900 block">Details</label>
              <textarea
                rows={5}
                placeholder="Include steps to reproduce, site affected, and expected behavior..."
                className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <Button>Submit Ticket</Button>
          </form>
        </section>
      </div>
    </AppShell>
  )
}

function QuickCard({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <button className="text-left bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-900 transition-colors precision-shadow">
      <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-slate-900" />
      </div>
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500">{desc}</p>
    </button>
  )
}

function ContactCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center gap-4">
      <div className="w-11 h-11 bg-slate-900 rounded-md flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
      </div>
    </div>
  )
}
