"use client"

import type React from "react"

import { useState } from "react"
import { Lock, Mail, Shield } from "lucide-react"
import { registerUser, authenticateUser, setSession } from "@/lib/auth"
import { useRouter } from "next/navigation"

type AuthMode = "signin" | "signup"

export default function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "signup") {
        if (!registerUser(email, password)) {
          setError("Email already registered")
          setLoading(false)
          return
        }
        setMode("signin")
        setPassword("")
      } else {
        if (!authenticateUser(email, password)) {
          setError("Invalid email or password")
          setLoading(false)
          return
        }
        setSession(email)
        router.push("/vault")
      }
    } catch (err) {
      setError("An error occurred")
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-2xl p-8 border border-border shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary to-secondary" />

        <div className="relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-6 fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg secure-pulse">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 fade-in-up">
            {mode === "signin" ? "Sign in to your vault" : "Create your vault"}
          </h1>
          <p className="text-center text-muted-foreground mb-8 fade-in-up">
            Your passwords are encrypted and only you can access them
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="fade-in-up">
              <label className="block text-sm font-medium mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="fade-in-up">
              <label className="block text-sm font-medium mb-2">
                {mode === "signin" ? "Master password" : "Create master password"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your master password"
                  className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-destructive text-sm font-medium fade-in-up">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="gradient-button w-full mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : mode === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center text-sm mt-6 fade-in-up">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin")
                setError("")
              }}
              className="text-primary hover:text-secondary hover:underline font-semibold transition-colors duration-200"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
