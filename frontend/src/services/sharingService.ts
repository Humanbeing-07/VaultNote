import {
  apiDelete,
  apiGet,
  apiPost,
} from './api'

export type SharePermission =
  | 'view'
  | 'edit'

export type ShareRequest = {
  noteId: string
  recipientEmail: string
  permission: SharePermission
  encryptedNoteKey: string
}

export type ShareRecord = {
  id: string
  noteId: string
  recipientEmail: string
  permission: SharePermission
  encryptedNoteKey: string
  createdAt: string
  revokedAt?: string | null
}

export type SharedNote = {
  id: string
  noteId: string
  ownerEmail: string
  permission: SharePermission
  encryptedNoteKey: string
  createdAt: string
}

/**
 * Share an encrypted note with another user.
 *
 * IMPORTANT:
 * The server receives only the encrypted
 * note key, never the plaintext note key.
 */
export async function shareNote(
  data: ShareRequest
): Promise<ShareRecord> {
  if (!data.noteId.trim()) {
    throw new Error(
      'Note ID is required.'
    )
  }

  if (!data.recipientEmail.trim()) {
    throw new Error(
      'Recipient email is required.'
    )
  }

  if (!data.encryptedNoteKey) {
    throw new Error(
      'Encrypted note key is required.'
    )
  }

  if (
    data.permission !== 'view' &&
    data.permission !== 'edit'
  ) {
    throw new Error(
      'Invalid sharing permission.'
    )
  }

  return apiPost<ShareRecord>(
    '/shares',
    {
      noteId: data.noteId,
      recipientEmail:
        data.recipientEmail
          .trim()
          .toLowerCase(),
      permission:
        data.permission,
      encryptedNoteKey:
        data.encryptedNoteKey,
    }
  )
}

/**
 * Get users with whom the note
 * has been shared.
 */
export async function getNoteShares(
  noteId: string
): Promise<ShareRecord[]> {
  if (!noteId.trim()) {
    throw new Error(
      'Note ID is required.'
    )
  }

  return apiGet<ShareRecord[]>(
    `/shares/note/${encodeURIComponent(noteId)}`
  )
}

/**
 * Get notes shared with the
 * currently authenticated user.
 */
export async function getSharedNotes(): Promise<
  SharedNote[]
> {
  return apiGet<SharedNote[]>(
    '/shares/received'
  )
}

/**
 * Revoke a user's access to a note.
 */
export async function revokeShare(
  shareId: string
): Promise<void> {
  if (!shareId.trim()) {
    throw new Error(
      'Share ID is required.'
    )
  }

  await apiDelete(
    `/shares/${encodeURIComponent(shareId)}`
  )
}

/**
 * Update sharing permission.
 */
export async function updateSharePermission(
  shareId: string,
  permission: SharePermission
): Promise<ShareRecord> {
  if (!shareId.trim()) {
    throw new Error(
      'Share ID is required.'
    )
  }

  if (
    permission !== 'view' &&
    permission !== 'edit'
  ) {
    throw new Error(
      'Invalid sharing permission.'
    )
  }

  return apiPost<ShareRecord>(
    `/shares/${encodeURIComponent(
      shareId
    )}/permission`,
    {
      permission,
    }
  )
}