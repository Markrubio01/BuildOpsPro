"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Building2, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const steps = [
  { id: 1, title: "Personal Details", desc: "Your identity credentials" },
  { id: 2, title: "Company Info", desc: "Employer & site details" },
  { id: 3, title: "Security Setup", desc: "Secure your account" },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const next = () => {
    if (step < 3) setStep(step + 1)
    else router.push("/dashboard")
  }
  const back = () => (step > 1 ? setStep(step - 1) : router.push("/login"))

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-8 flex items-center justify-between">
        <Link href="/login" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-950 rounded flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tighter text-slate-950">BuildOps Pro</span>
        </Link>
        <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 uppercase tracking-widest">
          Already have access?
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          {/* Progress steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      step > s.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : step === s.id
                          ? "bg-white text-slate-900 border-slate-900"
                          : "bg-white text-slate-400 border-slate-200"
                    }`}
                  >
                    {step > s.id ? <Check className="h-4 w-4" /> : s.id}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? "bg-slate-900" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Step {step} of {steps.length}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950 mt-1">
                {steps[step - 1].title}
              </h1>
              <p className="text-slate-600 text-sm mt-1">{steps[step - 1].desc}</p>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8">
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="First Name" placeholder="Marcus" />
                  <Field label="Last Name" placeholder="Thorne" />
                </div>
                <Field label="Work Email" placeholder="m.thorne@industrialcorp.com" type="email" />
                <Field label="Phone Number" placeholder="+1 (555) 123-4567" type="tel" />
                <Field label="Trade / Role" placeholder="Site Foreman" />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-5">
                <Field label="Company Name" placeholder="Industrial Corp." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Employee ID" placeholder="#44021" />
                  <Field label="Hire Date" type="date" />
                </div>
                <Field label="Primary Site Code" placeholder="SKY-002" />
                <Field label="Supervisor Email" placeholder="supervisor@industrialcorp.com" type="email" />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-5">
                <Field label="Create Password" placeholder="••••••••••••" type="password" />
                <Field label="Confirm Password" placeholder="••••••••••••" type="password" />
                <div className="p-4 border border-slate-200 rounded-md bg-slate-50">
                  <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-2">
                    Password Requirements
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Minimum 12 characters</li>
                    <li>• At least one uppercase letter and number</li>
                    <li>• One special character (!@#$%)</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-100">
              <Button variant="ghost" onClick={back}>
                <ArrowLeft className="h-4 w-4" />
                {step === 1 ? "Back to Sign In" : "Previous"}
              </Button>
              <Button onClick={next}>
                {step === 3 ? "Request Access" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-900 block">{label}</label>
      <Input {...props} className="h-12 bg-slate-50 border-slate-200" />
    </div>
  )
}
