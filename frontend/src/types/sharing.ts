/**
 * Permissions available for a shared note.
 */
export type SharePermission =
  | 'view'
  | 'edit'

/**
 * Information required to create
 * a new share.
 */
export type CreateShareInput = {
  noteId: string
  recipientEmail: string
  permission: SharePermission
}

/**
 * Encrypted note key shared with
 * another user.
 *
 * The server must never receive the
 * plaintext note key.
 */
export type EncryptedNoteKey = {
  encryptedKey: string
  iv: string
}

/**
 * Complete share record.
 */
export type ShareRecord = {
  id: string
  noteId: string
  ownerId: string
  recipientId: string
  recipientEmail: string
  permission: SharePermission
  encryptedNoteKey: EncryptedNoteKey
  createdAt: string
  revokedAt: string | null
}

/**
 * Note received through sharing.
 */
export type SharedNote = {
  id: string
  noteId: string
  ownerId: string
  ownerEmail: string
  permission: SharePermission
  encryptedNoteKey: EncryptedNoteKey
  createdAt: string
  revokedAt: string | null
}

/**
 * Data required to revoke
 * a shared note.
 */
export type RevokeShareInput = {
  shareId: string
}

/**
 * Data required to change
 * sharing permission.
 */
export type UpdateSharePermissionInput = {
  shareId: string
  permission: SharePermission
}

/**
 * Sharing state used by UI.
 */
export type SharingState = {
  loading: boolean
  error: string | null
}

/**
 * Sharing modal state.
 */
export type ShareModalState = {
  isOpen: boolean
  noteId: string | null
}

/**
 * Recipient information.
 */
export type ShareRecipient = {
  userId: string
  email: string
  name?: string
}

/**
 * Access status of a shared note.
 */
export type ShareAccessStatus =
  | 'active'
  | 'revoked'
  | 'expired'