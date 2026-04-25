import Link from "next/link"
import { ArrowLeft, Mail, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-8 flex items-center">
        <Link href="/login" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-950 rounded flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-black uppercase tracking-tighter text-slate-950">BuildOps Pro</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 md:p-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest mb-6">
            <ArrowLeft className="h-3 w-3" /> Back to Sign In
          </Link>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Password Recovery</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950 mt-1">Reset Security Key</h1>
          <p className="text-slate-600 text-sm mt-2 mb-6">
            Enter your work email and we&apos;ll send a reset link to re-establish your credentials.
          </p>
          <form className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-900 block">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="m.thorne@industrialcorp.com" type="email" className="h-12 pl-10 bg-slate-50 border-slate-200" />
              </div>
            </div>
            <Button size="lg" className="w-full h-12">Send Reset Link</Button>
          </form>
          <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-md">
            <p className="text-xs text-slate-600 leading-relaxed">
              Didn&apos;t receive the email? Check spam or contact site IT at{" "}
              <span className="font-bold text-slate-900">it-support@buildops.pro</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
