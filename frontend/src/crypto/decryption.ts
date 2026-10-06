import {
  base64ToBuffer,
  getMasterKey,
} from './keys'

import type { EncryptedData } from './encryption'

/**
 * Decrypt encrypted text using AES-256-GCM.
 */
export async function decryptText(
  encryptedData: EncryptedData
): Promise<string> {
  if (
    !encryptedData ||
    !encryptedData.ciphertext ||
    !encryptedData.iv
  ) {
    throw new Error(
      'Invalid encrypted data.'
    )
  }

  const key = await getMasterKey()

  const ciphertext =
    base64ToBuffer(
      encryptedData.ciphertext
    )

  const iv =
    base64ToBuffer(
      encryptedData.iv
    )

  try {
    const plaintext =
      await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv,
          tagLength: 128,
        },
        key,
        ciphertext
      )

    const decoder =
      new TextDecoder()

    return decoder.decode(
      plaintext
    )
  } catch (error) {
    console.error(
      'Decryption failed:',
      error
    )

    throw new Error(
      'Unable to decrypt this note. The encryption key may be invalid or the data may have been modified.'
    )
  }
}

/**
 * Decrypt a complete note.
 */
export async function decryptNote(
  encryptedTitle: EncryptedData,
  encryptedContent: EncryptedData
): Promise<{
  title: string
  content: string
}> {
  const [
    title,
    content,
  ] = await Promise.all([
    decryptText(encryptedTitle),
    decryptText(encryptedContent),
  ])

  return {
    title,
    content,
  }
}