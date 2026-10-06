const KEY_STORAGE_NAME = 'vaultnote_master_key'

/**
 * Convert ArrayBuffer / Uint8Array to Base64
 */
export function bufferToBase64(
  buffer: ArrayBuffer | Uint8Array
): string {
  const bytes =
    buffer instanceof Uint8Array
      ? buffer
      : new Uint8Array(buffer)

  let binary = ''

  const chunkSize = 0x8000

  for (
    let i = 0;
    i < bytes.length;
    i += chunkSize
  ) {
    const chunk = bytes.subarray(
      i,
      i + chunkSize
    )

    binary += String.fromCharCode(
      ...chunk
    )
  }

  return btoa(binary)
}

/**
 * Convert Base64 to Uint8Array
 */
export function base64ToBuffer(
  base64: string
): Uint8Array {
  const binary = atob(base64)

  const bytes = new Uint8Array(
    binary.length
  )

  for (
    let i = 0;
    i < binary.length;
    i++
  ) {
    bytes[i] =
      binary.charCodeAt(i)
  }

  return bytes
}

/**
 * Generate a new AES-256-GCM key
 */
export async function generateMasterKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    [
      'encrypt',
      'decrypt',
    ]
  )
}

/**
 * Export CryptoKey to Base64
 */
export async function exportKey(
  key: CryptoKey
): Promise<string> {
  const rawKey =
    await crypto.subtle.exportKey(
      'raw',
      key
    )

  return bufferToBase64(rawKey)
}

/**
 * Import Base64 key into CryptoKey
 */
export async function importKey(
  encodedKey: string
): Promise<CryptoKey> {
  const rawKey =
    base64ToBuffer(encodedKey)

  return crypto.subtle.importKey(
    'raw',
    rawKey,
    {
      name: 'AES-GCM',
    },
    true,
    [
      'encrypt',
      'decrypt',
    ]
  )
}

/**
 * Generate or restore the local master key.
 *
 * NOTE:
 * This localStorage implementation is
 * for the frontend prototype only.
 *
 * Production version should derive/
 * unwrap the key from proper user
 * authentication and key-management
 * flow instead of storing a raw master
 * key in localStorage.
 */
export async function getMasterKey(): Promise<CryptoKey> {
  const storedKey =
    localStorage.getItem(
      KEY_STORAGE_NAME
    )

  if (storedKey) {
    return importKey(storedKey)
  }

  const newKey =
    await generateMasterKey()

  const exportedKey =
    await exportKey(newKey)

  localStorage.setItem(
    KEY_STORAGE_NAME,
    exportedKey
  )

  return newKey
}

/**
 * Remove locally stored key.
 */
export function clearMasterKey(): void {
  localStorage.removeItem(
    KEY_STORAGE_NAME
  )
}

/**
 * Check whether a local key exists.
 */
export function hasMasterKey(): boolean {
  return (
    localStorage.getItem(
      KEY_STORAGE_NAME
    ) !== null
  )
}

/**
 * Generate a random AES-GCM IV.
 *
 * AES-GCM should use a fresh IV for
 * every encryption operation.
 */
export function generateIV(): Uint8Array {
  const iv = new Uint8Array(12)

  crypto.getRandomValues(iv)

  return iv
}