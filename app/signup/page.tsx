'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Mail, KeyRound, User, Building2, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { signupUser } from '@/lib/auth'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const departments = ['Engineering', 'Operations', 'Management', 'Safety', 'HR']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full name is required')
      setIsLoading(false)
      return
    }

    if (!formData.email.includes('@')) {
      setError('Valid email is required')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!formData.department) {
      setError('Department is required')
      setIsLoading(false)
      return
    }

    try {
      const result = await signupUser(formData.email, formData.password, formData.fullName, formData.department)

      if (result.error) {
        setError(result.error)
      } else {
        console.log('[v0] Signup successful, redirecting to dashboard')
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('[v0] Signup error:', err)
      setError('Sign up failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 blueprint-grid opacity-40" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-lg">
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
              Join the Team.
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Create your account to access the industrial construction management platform. Manage projects, track time, and oversee operations.
            </p>
          </div>

          <div className="relative z-10">
            <p className="text-slate-300 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-white font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </section>

        <section className="col-span-1 md:col-span-7 p-6 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950 mb-2">
              Create Account
            </h2>
            <p className="text-slate-600 text-sm mb-8">
              Sign up to get started with BuildOps Pro
            </p>

            <form onSubmit={handleSignup} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="fullName" className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="h-12 pl-10 bg-slate-50 border-slate-200"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    className="h-12 pl-10 bg-slate-50 border-slate-200"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="department" className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                  Department
                </label>
                <Select value={formData.department} onValueChange={handleSelectChange}>
                  <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••••••"
                    className="h-12 pl-10 bg-slate-50 border-slate-200"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••••••"
                    className="h-12 pl-10 bg-slate-50 border-slate-200"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-[11px] text-slate-500 uppercase tracking-widest mt-6">
              Already registered? <Link href="/login" className="font-semibold text-slate-900 hover:underline">Sign in</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
