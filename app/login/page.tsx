import Link from "next/link"
import { ArrowRight, Fingerprint, KeyRound, Mail, HelpCircle, ShieldCheck, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-950">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 blueprint-grid opacity-40" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-lg">
        {/* Left: Branding */}
        <section className="hidden md:flex md:col-span-5 bg-slate-950 p-10 flex-col justify-between text-white relative">
          <div className="absolute inset-0 blueprint-grid opacity-30" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-md">
                <Building2 className="h-6 w-6 text-slate-950" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">BuildOps Pro</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight tracking-tight">
              Secure Site Office Portal.
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Precision management for industrial-scale operations. Access your blueprints, personnel data, and site
              logistics from a single authoritative source.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="p-4 border-l-2 border-slate-400 bg-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                Current Site Status
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                <span className="text-lg font-semibold">Operational</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>256-bit Encrypted Session</span>
            </div>
          </div>
        </section>

        {/* Right: Form */}
        <section className="col-span-1 md:col-span-7 p-6 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="md:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-slate-950 flex items-center justify-center rounded-md">
                <Building2 className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase text-slate-950">BuildOps Pro</span>
            </div>
            <div className="mb-8">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-3">
                Authentication Required
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">Welcome Back</h2>
              <p className="text-slate-600 mt-3 text-sm">
                Please enter your credentials to access the secure portal.
              </p>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="p.manager@industrialcorp.com"
                    className="h-12 pl-10 bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="key" className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                    Security Key
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-slate-900 hover:underline">
                    Forgot Key?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="key"
                    type="password"
                    placeholder="••••••••••••"
                    className="h-12 pl-10 bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Remember this terminal
                </label>
              </div>

              <div className="space-y-3 pt-2">
                <Button asChild size="lg" className="w-full h-12 text-base">
                  <Link href="/dashboard">
                    Sign In to Portal
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    OR Secure Sign-in
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <Button asChild variant="outline" size="lg" className="w-full h-12 text-base">
                  <Link href="/biometric">
                    <Fingerprint className="h-5 w-5" />
                    Biometric Unlock
                  </Link>
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
              <p className="text-xs text-slate-500">
                New to the site?{" "}
                <Link href="/signup" className="font-bold text-slate-900 hover:underline">
                  Request Access
                </Link>
              </p>
              <div className="flex gap-4 text-xs">
                <Link href="#" className="font-semibold text-slate-500 hover:text-slate-900">
                  Privacy
                </Link>
                <Link href="/help" className="font-semibold text-slate-500 hover:text-slate-900">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating help */}
      <Link
        href="/help"
        className="fixed bottom-6 right-6 z-20 w-12 h-12 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all"
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5 text-slate-900" />
      </Link>
    </div>
  )
}
