/**
 * Generic localStorage helpers for VaultNote.
 *
 * NOTE:
 * Do NOT use this utility to store plaintext
 * notes, passwords, encryption keys, or other
 * sensitive plaintext data.
 */

export function setStorageItem<T>(
  key: string,
  value: T
): void {
  try {
    const serialized =
      JSON.stringify(value)

    localStorage.setItem(
      key,
      serialized
    )
  } catch (error) {
    console.error(
      `Failed to save storage item: ${key}`,
      error
    )

    throw new Error(
      'Unable to save local data.'
    )
  }
}

export function getStorageItem<T>(
  key: string
): T | null {
  try {
    const stored =
      localStorage.getItem(key)

    if (stored === null) {
      return null
    }

    return JSON.parse(stored) as T
  } catch (error) {
    console.error(
      `Failed to read storage item: ${key}`,
      error
    )

    return null
  }
}

export function removeStorageItem(
  key: string
): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(
      `Failed to remove storage item: ${key}`,
      error
    )
  }
}

export function hasStorageItem(
  key: string
): boolean {
  try {
    return (
      localStorage.getItem(key) !==
      null
    )
  } catch (error) {
    console.error(
      `Failed to check storage item: ${key}`,
      error
    )

    return false
  }
}

export function clearStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error(
      'Failed to clear local storage:',
      error
    )
  }
}

/**
 * Store a simple string.
 */
export function setStorageString(
  key: string,
  value: string
): void {
  try {
    localStorage.setItem(
      key,
      value
    )
  } catch (error) {
    console.error(
      `Failed to save string: ${key}`,
      error
    )
  }
}

/**
 * Get a simple string.
 */
export function getStorageString(
  key: string
): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(
      `Failed to read string: ${key}`,
      error
    )

    return null
  }
}

/**
 * Remove multiple storage keys.
 */
export function removeStorageItems(
  keys: string[]
): void {
  keys.forEach((key) => {
    removeStorageItem(key)
  })
}