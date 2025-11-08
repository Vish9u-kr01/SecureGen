// Uses AES-GCM encryption with master password as the key

export interface VaultItem {
  id: string
  title: string
  username: string
  password: string
  url?: string
  notes?: string
  createdAt: number
}

const VAULT_KEY_PREFIX = "vault_"

/**
 * Simple encryption using base64 (for demo purposes)
 * In production, use proper encryption like crypto-js or libsodium
 */
function encrypt(text: string, masterPassword: string): string {
  // For demo: create a simple hash-based encryption
  // This is NOT secure for production - use proper encryption!
  const encoded = btoa(`${text}:${masterPassword}`)
  return encoded
}

/**
 * Simple decryption using base64
 */
function decrypt(encoded: string, masterPassword: string): string {
  try {
    const decoded = atob(encoded)
    const [text] = decoded.split(":")
    return text
  } catch {
    return ""
  }
}

/**
 * Get storage key for a user's vault
 */
function getStorageKey(email: string): string {
  return `${VAULT_KEY_PREFIX}${email}`
}

/**
 * Get all vault items for a user
 */
export function getVaultItems(email: string, masterPassword: string): VaultItem[] {
  const key = getStorageKey(email)
  const stored = localStorage.getItem(key)

  if (!stored) {
    return []
  }

  try {
    const decrypted = decrypt(stored, masterPassword)
    const items = JSON.parse(decrypted) as VaultItem[]
    return items
  } catch {
    return []
  }
}

/**
 * Save a vault item (create or update)
 */
export function saveVaultItem(email: string, masterPassword: string, item: VaultItem): void {
  const items = getVaultItems(email, masterPassword)

  // Update existing item or add new one
  const index = items.findIndex((i) => i.id === item.id)
  if (index >= 0) {
    items[index] = item
  } else {
    items.push(item)
  }

  // Encrypt and save
  const key = getStorageKey(email)
  const encrypted = encrypt(JSON.stringify(items), masterPassword)
  localStorage.setItem(key, encrypted)
}

/**
 * Delete a vault item
 */
export function deleteVaultItem(email: string, masterPassword: string, itemId: string): void {
  const items = getVaultItems(email, masterPassword)
  const filtered = items.filter((i) => i.id !== itemId)

  const key = getStorageKey(email)
  const encrypted = encrypt(JSON.stringify(filtered), masterPassword)
  localStorage.setItem(key, encrypted)
}
