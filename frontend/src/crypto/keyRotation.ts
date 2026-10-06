import {
  base64ToBuffer,
  bufferToBase64,
  exportKey,
  generateMasterKey,
  importKey,
} from './keys'

const KEY_STORAGE_NAME =
  'vaultnote_master_key'

/**
 * Rotate the current encryption key.
 *
 * Important:
 * Existing encrypted notes must be
 * re-encrypted with the new key before
 * the old key is permanently removed.
 */
export async function rotateMasterKey(): Promise<{
  oldKey: CryptoKey
  newKey: CryptoKey
}> {
  const storedKey =
    localStorage.getItem(
      KEY_STORAGE_NAME
    )

  if (!storedKey) {
    throw new Error(
      'No existing encryption key found.'
    )
  }

  const oldKey =
    await importKey(storedKey)

  const newKey =
    await generateMasterKey()

  return {
    oldKey,
    newKey,
  }
}

/**
 * Store the newly generated key.
 *
 * Call this only after all existing
 * encrypted data has been successfully
 * re-encrypted with the new key.
 */
export async function commitKeyRotation(
  newKey: CryptoKey
): Promise<void> {
  const exportedKey =
    await exportKey(newKey)

  localStorage.setItem(
    KEY_STORAGE_NAME,
    exportedKey
  )
}

/**
 * Re-encrypt one encrypted value
 * from an old key to a new key.
 */
export async function reencryptText(
  ciphertext: string,
  iv: string,
  oldKey: CryptoKey,
  newKey: CryptoKey
): Promise<{
  ciphertext: string
  iv: string
}> {
  const oldCiphertext =
    base64ToBuffer(ciphertext)

  const oldIV =
    base64ToBuffer(iv)

  // Decrypt using old key
  const plaintext =
    await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: oldIV,
        tagLength: 128,
      },
      oldKey,
      oldCiphertext
    )

  // Generate fresh IV
  const newIV =
    new Uint8Array(12)

  crypto.getRandomValues(
    newIV
  )

  // Encrypt using new key
  const newCiphertext =
    await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: newIV,
        tagLength: 128,
      },
      newKey,
      plaintext
    )

  return {
    ciphertext:
      bufferToBase64(
        newCiphertext
      ),
    iv:
      bufferToBase64(
        newIV
      ),
  }
}