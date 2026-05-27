import { createSupabaseClient } from './supabase'

export type Session = {
  user: {
    id: string
    email: string
    full_name: string
    avatar_url?: string
  }
  accessToken: string
  expiresAt: number
}

// Session Management Functions
export function saveSession(session: Session) {
  if (typeof window !== "undefined") {
    localStorage.setItem("buildops_session", JSON.stringify(session))
    localStorage.setItem("buildops_session_expires", session.expiresAt.toString())
  }
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null

  const sessionStr = localStorage.getItem("buildops_session")
  const expiresAt = localStorage.getItem("buildops_session_expires")

  if (!sessionStr || !expiresAt) return null

  // Check if session is expired
  if (Date.now() > parseInt(expiresAt)) {
    clearSession()
    return null
  }

  try {
    return JSON.parse(sessionStr)
  } catch {
    clearSession()
    return null
  }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("buildops_session")
    localStorage.removeItem("buildops_session_expires")
  }
}

// Authentication Functions
export async function loginUser(email: string, password: string) {
  try {
    const supabase = createSupabaseClient()

    // Get user from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, full_name, avatar_url, password_hash")
      .eq("email", email)
      .single()

    if (userError || !userData) {
      return { error: "Invalid email or password" }
    }

    // Simple password verification (in production, use bcrypt)
    // For now, we'll just check if password matches (you should use proper hashing)
    if (userData.password_hash !== password) {
      return { error: "Invalid email or password" }
    }

    // Create session token
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    const session: Session = {
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        avatar_url: userData.avatar_url,
      },
      accessToken: `token_${userData.id}_${Date.now()}`,
      expiresAt,
    }

    saveSession(session)

    return { session }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { error: "Login failed. Please try again." }
  }
}

export function logoutUser() {
  clearSession()
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

// Sign Up Function
export async function signupUser(email: string, password: string, fullName: string, department: string) {
  try {
    const supabase = createSupabaseClient()

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (existingUser) {
      return { error: "Email already registered" }
    }

    // Generate employee ID
    const employeeId = `EMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: password,
        full_name: fullName,
        employee_id: employeeId,
        department,
        role: "worker",
        title: "Employee",
        hire_date: new Date().toISOString().split("T")[0],
        status: "active",
      })
      .select("id, email, full_name, avatar_url")
      .single()

    if (insertError || !newUser) {
      return { error: "Failed to create account" }
    }

    // Create session token
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    const session: Session = {
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        avatar_url: newUser.avatar_url,
      },
      accessToken: `token_${newUser.id}_${Date.now()}`,
      expiresAt,
    }

    saveSession(session)

    return { session }
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return { error: "Sign up failed. Please try again." }
  }
}
