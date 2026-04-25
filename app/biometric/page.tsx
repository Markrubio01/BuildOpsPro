import Link from "next/link"
import { ArrowLeft, Fingerprint, Building2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BiometricPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
      <header className="relative z-10 h-16 border-b border-slate-800 px-4 md:px-8 flex items-center">
        <Link href="/login" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <Building2 className="h-4 w-4 text-slate-950" strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tighter">BuildOps Pro</span>
        </Link>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest mb-8">
            <ArrowLeft className="h-3 w-3" /> Back to Sign In
          </Link>

          <div className="relative mx-auto mb-8 w-36 h-36">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping" />
            <div className="absolute inset-4 rounded-full border-2 border-emerald-400/40 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Fingerprint className="h-20 w-20 text-emerald-400" strokeWidth={1.5} />
            </div>
          </div>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Biometric Verification
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Scan Fingerprint</h1>
          <p className="text-slate-400 text-sm mb-8">
            Place your finger on the sensor or look directly at the camera for secure access to the site portal.
          </p>

          <Button asChild size="lg" className="w-full h-12 bg-white text-slate-950 hover:bg-slate-100">
            <Link href="/dashboard">
              <Fingerprint className="h-5 w-5" />
              Simulate Scan &amp; Continue
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="w-full mt-2 text-slate-400 hover:bg-slate-900 hover:text-white">
            <Link href="/login">Use Password Instead</Link>
          </Button>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4" />
            <span>Encrypted via Platform Secure Enclave</span>
          </div>
        </div>
      </main>
    </div>
  )
}
