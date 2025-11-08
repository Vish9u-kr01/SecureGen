"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession, clearSession } from "@/lib/auth"
import { getVaultItems, type VaultItem } from "@/lib/vault-storage"
import VaultList from "@/components/vault-list"
import PasswordGenerator from "@/components/password-generator"
import { Moon, Sun, LogOut, Lock } from "lucide-react"

export default function VaultPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [masterPassword, setMasterPassword] = useState("")
  const [items, setItems] = useState<VaultItem[]>([])
  const [showGenerator, setShowGenerator] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const session = getSession()
    if (!session) {
      router.push("/")
      return
    }
    setEmail(session)

    // Prompt for master password if not already entered
    const pwd = sessionStorage.getItem("vault_master_password")
    if (!pwd) {
      const entered = prompt("Enter your master password:")
      if (!entered) {
        clearSession()
        router.push("/")
        return
      }
      sessionStorage.setItem("vault_master_password", entered)
      setMasterPassword(entered)
    } else {
      setMasterPassword(pwd)
    }

    // Check for dark mode preference
    const prefersDark = localStorage.getItem("vault_dark_mode") === "true"
    setIsDark(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add("dark")
    }

    setLoading(false)
  }, [router])

  useEffect(() => {
    if (masterPassword && email) {
      const vaultItems = getVaultItems(email, masterPassword)
      setItems(vaultItems)
    }
  }, [masterPassword, email])

  const toggleDarkMode = () => {
    const newDark = !isDark
    setIsDark(newDark)
    localStorage.setItem("vault_dark_mode", newDark.toString())
    if (newDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("vault_master_password")
    clearSession()
    router.push("/")
  }

  const handleItemDeleted = () => {
    const vaultItems = getVaultItems(email, masterPassword)
    setItems(vaultItems)
  }

  const handleItemSaved = () => {
    const vaultItems = getVaultItems(email, masterPassword)
    setItems(vaultItems)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" />
          <p className="text-muted-foreground font-medium">Loading vault...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50 dark:via-slate-900 dark:to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <Lock size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-card-foreground">My Vault</h1>
              <p className="text-muted-foreground text-sm">{email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-3 hover:bg-card rounded-lg transition-colors border border-border hover:shadow-md"
              title="Toggle dark mode"
            >
              {isDark ? (
                <Sun size={20} className="text-muted-foreground" />
              ) : (
                <Moon size={20} className="text-muted-foreground" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vault List */}
          <div className="lg:col-span-2">
            <VaultList
              items={items}
              email={email}
              masterPassword={masterPassword}
              onItemDeleted={handleItemDeleted}
              onItemSaved={handleItemSaved}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats Card */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-lg vault-card fade-in-up">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Total Entries</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {items.length}
              </p>
              <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${Math.min((items.length / 50) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Password Generator */}
            {showGenerator ? (
              <>
                <PasswordGenerator />
                <button
                  onClick={() => setShowGenerator(false)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                >
                  Hide Generator
                </button>
              </>
            ) : (
              <button onClick={() => setShowGenerator(true)} className="gradient-button w-full fade-in-up">
                Show Generator
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
