"use client"

import { useState } from "react"
import { Copy, Edit2, Trash2, Eye, EyeOff, Search, CheckCircle } from "lucide-react"
import { type VaultItem, deleteVaultItem } from "@/lib/vault-storage"
import VaultItemModal from "./vault-item-modal"

interface VaultListProps {
  items: VaultItem[]
  email: string
  masterPassword: string
  onItemDeleted: () => void
  onItemSaved: () => void
}

export default function VaultList({ items, email, masterPassword, onItemDeleted, onItemSaved }: VaultListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied({ ...copied, [key]: true })
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [key]: false }))
    }, 2000)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteVaultItem(email, masterPassword, id)
      onItemDeleted()
    }
  }

  const handleEdit = (item: VaultItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleNewItem = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  return (
    <div className="w-full space-y-4">
      {/* Search */}
      <div className="relative fade-in-up">
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search vault entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Add New Button */}
      <button onClick={handleNewItem} className="gradient-button w-full fade-in-up">
        + Add New Entry
      </button>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-5xl mb-2 opacity-50">🔐</div>
          {items.length === 0 ? "No vault entries yet" : "No results found"}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 vault-card fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground truncate text-base">{item.title}</h3>
                  {item.url && <p className="text-sm text-muted-foreground truncate">{item.url}</p>}
                  <p className="text-xs text-muted-foreground mt-1">User: {item.username}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  {/* Show/Hide Password */}
                  <button
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        [item.id]: !showPasswords[item.id],
                      })
                    }
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Toggle password visibility"
                  >
                    {showPasswords[item.id] ? (
                      <EyeOff size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </button>

                  {/* Copy Password */}
                  <button
                    onClick={() => copyToClipboard(item.password, `password-${item.id}`)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Copy password"
                  >
                    {copied[`password-${item.id}`] ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <Copy size={18} className="text-muted-foreground" />
                    )}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Edit entry"
                  >
                    <Edit2 size={18} className="text-muted-foreground" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 size={18} className="text-destructive" />
                  </button>
                </div>
              </div>

              {/* Password Display */}
              {showPasswords[item.id] && (
                <div className="mt-3 pt-3 border-t border-border">
                  <code className="text-xs bg-input px-3 py-2 rounded-lg block text-card-foreground break-all font-mono">
                    {item.password}
                  </code>
                </div>
              )}

              {/* Notes Display */}
              {item.notes && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground font-medium">Notes:</p>
                  <p className="text-sm text-card-foreground mt-1">{item.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <VaultItemModal
          item={editingItem}
          email={email}
          masterPassword={masterPassword}
          onClose={() => setIsModalOpen(false)}
          onSave={() => {
            setIsModalOpen(false)
            onItemSaved()
          }}
        />
      )}
    </div>
  )
}
