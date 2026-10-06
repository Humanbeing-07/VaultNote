import {
  bufferToBase64,
  generateIV,
  getMasterKey,
} from './keys'

export type EncryptedData = {
  ciphertext: string
  iv: string
}

/**
 * Encrypt plain text using AES-256-GCM.
 */
export async function encryptText(
  plaintext: string
): Promise<EncryptedData> {
  if (!plaintext) {
    throw new Error(
      'Text to encrypt cannot be empty.'
    )
  }

  const key = await getMasterKey()

  const iv = generateIV()

  const encoder =
    new TextEncoder()

  const plaintextBytes =
    encoder.encode(plaintext)

  const ciphertext =
    await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128,
      },
      key,
      plaintextBytes
    )

  return {
    ciphertext:
      bufferToBase64(ciphertext),
    iv:
      bufferToBase64(iv),
  }
}

/**
 * Encrypt a complete note object.
 *
 * The returned object contains only
 * encrypted content and metadata.
 */
export async function encryptNote(
  title: string,
  content: string
): Promise<{
  encryptedTitle: EncryptedData
  encryptedContent: EncryptedData
}> {
  const [
    encryptedTitle,
    encryptedContent,
  ] = await Promise.all([
    encryptText(title),
    encryptText(content),
  ])

  return {
    encryptedTitle,
    encryptedContent,
  }
}