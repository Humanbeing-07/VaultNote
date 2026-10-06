const encoder = new TextEncoder()
const decoder = new TextDecoder()

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)

  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes.buffer
}

export async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 600000,
      hash: 'SHA-256',
    },
    passwordKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptText(
  text: string,
  key: CryptoKey
): Promise<string> {
  const iv = crypto.getRandomValues(
    new Uint8Array(12)
  )

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoder.encode(text)
  )

  return [
    bufferToBase64(iv.buffer),
    bufferToBase64(encrypted),
  ].join('.')
}

export async function decryptText(
  encryptedText: string,
  key: CryptoKey
): Promise<string> {
  const [ivBase64, encryptedBase64] =
    encryptedText.split('.')

  if (!ivBase64 || !encryptedBase64) {
    throw new Error('Invalid encrypted data')
  }

  const iv = new Uint8Array(
    base64ToBuffer(ivBase64)
  )

  const encrypted =
    base64ToBuffer(encryptedBase64)

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encrypted
  )

  return decoder.decode(decrypted)
}

export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(
    new Uint8Array(16)
  )
}

export function saltToBase64(
  salt: Uint8Array
): string {
  return bufferToBase64(salt.buffer)
}
