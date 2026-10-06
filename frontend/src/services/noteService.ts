import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from './api'

export type NoteResponse = {
  id: string
  encryptedTitle: string
  encryptedContent: string
  createdAt: string
  updatedAt: string
}

export type CreateEncryptedNoteRequest = {
  encryptedTitle: string
  encryptedContent: string
}

export type UpdateEncryptedNoteRequest = {
  encryptedTitle?: string
  encryptedContent?: string
}

export async function getNotes(): Promise<
  NoteResponse[]
> {
  const response =
    await apiGet<{
      success: boolean
      notes: NoteResponse[]
    }>('/notes')

  return response.notes
}

export async function getNote(
  noteId: string
): Promise<NoteResponse> {
  if (!noteId.trim()) {
    throw new Error(
      'Note ID is required.'
    )
  }

  const response =
    await apiGet<{
      success: boolean
      note: NoteResponse
    }>(
      `/notes/${encodeURIComponent(noteId)}`
    )

  return response.note
}

export async function createNote(
  data: CreateEncryptedNoteRequest
): Promise<NoteResponse> {
  if (!data.encryptedTitle) {
    throw new Error(
      'Encrypted title is required.'
    )
  }

  if (!data.encryptedContent) {
    throw new Error(
      'Encrypted content is required.'
    )
  }

  const response =
    await apiPost<{
      success: boolean
      note: NoteResponse
    }>('/notes', data)

  return response.note
}

export async function updateNote(
  noteId: string,
  data: UpdateEncryptedNoteRequest
): Promise<NoteResponse> {
  if (!noteId.trim()) {
    throw new Error(
      'Note ID is required.'
    )
  }

  const response =
    await apiPut<{
      success: boolean
      note: NoteResponse
    }>(
      `/notes/${encodeURIComponent(noteId)}`,
      data
    )

  return response.note
}

export async function deleteNote(
  noteId: string
): Promise<void> {
  if (!noteId.trim()) {
    throw new Error(
      'Note ID is required.'
    )
  }

  await apiDelete(
    `/notes/${encodeURIComponent(noteId)}`
  )
}