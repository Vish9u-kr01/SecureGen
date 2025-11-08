"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { type VaultItem, saveVaultItem } from "@/lib/vault-storage"
import PasswordGenerator from "./password-generator"

interface VaultItemModalProps {
  item: VaultItem | null
  email: string
  masterPassword: string
  onClose: () => void
  onSave: () => void
}

export default function VaultItemModal({ item, email, masterPassword, onClose, onSave }: VaultItemModalProps) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    username: item?.username || "",
    password: item?.password || "",
    url: item?.url || "",
    notes: item?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const vaultItem: VaultItem = {
      id: item?.id || crypto.randomUUID(),
      title: formData.title,
      username: formData.username,
      password: formData.password,
      url: formData.url,
      notes: formData.notes,
      createdAt: item?.createdAt || Date.now(),
    }

    saveVaultItem(email, masterPassword, vaultItem)
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <h2 className="text-xl font-bold">{item ? "Edit Entry" : "New Entry"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Gmail, AWS"
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username or email"
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium mb-2">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any notes..."
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
              />
            </div>

            {/* Submit */}
            <button type="submit" className="gradient-button w-full">
              {item ? "Update" : "Add"} Entry
            </button>
          </form>

          {/* Password Generator */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
              Generate Strong Password
            </p>
            <PasswordGenerator onGenerate={(pwd) => setFormData({ ...formData, password: pwd })} />
          </div>
        </div>
      </div>
    </div>
  )
}
