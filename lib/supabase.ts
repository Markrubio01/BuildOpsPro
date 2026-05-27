import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// Lazy initialization - only throw if actually used
let supabaseInstance: any = null

export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
}

// Export as getter for backwards compatibility
export const supabase = new Proxy({}, {
  get: () => getSupabase(),
}) as any

// Type definitions
export interface User {
  id: string
  email: string
  full_name: string
  employee_id: string
  department: string
  role: 'worker' | 'supervisor' | 'admin'
  avatar_url?: string
  created_at: string
}

export interface ClockInRecord {
  id: string
  user_id: string
  clock_in_time: string
  clock_out_time?: string
  total_hours?: number
  location_lat: number
  location_lng: number
  biometric_verified: boolean
  biometric_type?: string
  status: 'active' | 'completed'
  notes?: string
  created_at: string
  updated_at?: string
}

export interface Project {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  status: 'planning' | 'active' | 'completed'
  department: string
  created_by: string
  team_size?: number
  progress?: number
  created_at: string
  updated_at?: string
}

export interface Timesheet {
  id: string
  user_id: string
  project_id: string
  date: string
  hours_worked: number
  task_description: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  submitted_at?: string
  approved_by?: string
  approved_at?: string
  created_at: string
}
