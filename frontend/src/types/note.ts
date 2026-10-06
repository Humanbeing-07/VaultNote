/**
 * Basic note information.
 */
export type Note = {
  id: string
  title: string
  content: string
  preview: string
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  isShared: boolean
  isEncrypted: boolean
}

/**
 * Data required to create a note.
 */
export type CreateNoteInput = {
  title: string
  content: string
}

/**
 * Data used when updating a note.
 */
export type UpdateNoteInput = {
  title?: string
  content?: string
}

/**
 * Encrypted note data sent to the server.
 *
 * The server should only receive
 * encrypted values.
 */
export type EncryptedNote = {
  id: string
  encryptedTitle: string
  encryptedContent: string
  titleIv: string
  contentIv: string
  createdAt: string
  updatedAt: string
}

/**
 * Encrypted data structure.
 */
export type EncryptedField = {
  ciphertext: string
  iv: string
}

/**
 * Complete encrypted note payload.
 */
export type EncryptedNotePayload = {
  encryptedTitle: EncryptedField
  encryptedContent: EncryptedField
}

/**
 * Note creation payload for API.
 */
export type CreateEncryptedNoteInput = {
  encryptedTitle: EncryptedField
  encryptedContent: EncryptedField
}

/**
 * Note update payload for API.
 */
export type UpdateEncryptedNoteInput = {
  encryptedTitle?: EncryptedField
  encryptedContent?: EncryptedField
}

/**
 * Note sorting options.
 */
export type NoteSortOption =
  | 'newest'
  | 'oldest'
  | 'updated'
  | 'alphabetical'

/**
 * Note filter options.
 */
export type NoteFilterOption =
  | 'all'
  | 'favorites'
  | 'shared'
  | 'encrypted'

/**
 * Search result.
 */
export type NoteSearchResult = {
  note: Note
  matchedTitle: boolean
  matchedContent: boolean
}

/**
 * Note loading state.
 */
export type NoteLoadingState = {
  loading: boolean
  error: string | null
}