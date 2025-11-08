// Uses localStorage to store user credentials (in production, use proper backend auth)

interface User {
  email: string
  password: string
}

const USERS_KEY = "vault_users"
const SESSION_KEY = "vault_session"

/**
 * Register a new user
 * @param email - User email
 * @param password - User password
 * @returns true if registration successful, false if email already exists
 */
export function registerUser(email: string, password: string): boolean {
  if (!email || !password) {
    return false
  }

  const users = getAllUsers()

  // Check if user already exists
  if (users.some((u) => u.email === email)) {
    return false
  }

  // Add new user
  users.push({
    email,
    password, // In production, this should be hashed with bcrypt or similar
  })

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return true
}

/**
 * Authenticate a user
 * @param email - User email
 * @param password - User password
 * @returns true if authentication successful
 */
export function authenticateUser(email: string, password: string): boolean {
  if (!email || !password) {
    return false
  }

  const users = getAllUsers()
  const user = users.find((u) => u.email === email && u.password === password)

  return !!user
}

/**
 * Set a user session
 * @param email - User email
 */
export function setSession(email: string): void {
  sessionStorage.setItem(SESSION_KEY, email)
}

/**
 * Get current user session
 * @returns User email if session exists, null otherwise
 */
export function getSession(): string | null {
  return sessionStorage.getItem(SESSION_KEY)
}

/**
 * Clear user session
 */
export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem("vault_master_password")
}

/**
 * Get all registered users (for internal use)
 * @returns Array of users
 */
function getAllUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY)
  return stored ? JSON.parse(stored) : []
}
