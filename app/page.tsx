"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/auth"
import AuthForm from "@/components/auth-form"
import { Lock } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Redirect to vault if already logged in
    const session = getSession()
    if (session) {
      router.push("/vault")
    }
  }, [router])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-12 fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <Lock size={32} className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-card-foreground mb-4 text-balance">
            Secure Password Vault
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Keep your passwords safe and organized. Encrypted storage, local-first security. Your passwords never leave
            your device.
          </p>
        </div>

        {/* Auth Form */}
        <div className="flex justify-center fade-in-up">
          <AuthForm />
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-6 border border-border shadow-lg vault-card text-center fade-in-up">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
            <p className="text-sm text-muted-foreground">All data encrypted locally with your master password</p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border shadow-lg vault-card text-center fade-in-up">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Fast & Responsive</h3>
            <p className="text-sm text-muted-foreground">Lightning-fast search and instant access to your passwords</p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border shadow-lg vault-card text-center fade-in-up">
            <div className="text-3xl mb-3">🎲</div>
            <h3 className="font-semibold mb-2">Generate Strong Passwords</h3>
            <p className="text-sm text-muted-foreground">
              Built-in secure password generator with customizable options
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
