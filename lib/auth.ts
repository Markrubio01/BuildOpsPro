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
