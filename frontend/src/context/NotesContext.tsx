import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

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

type CreateNoteInput = {
  title: string
  content: string
}

type UpdateNoteInput = {
  title?: string
  content?: string
}

type NotesContextType = {
  notes: Note[]
  loading: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredNotes: Note[]
  getNote: (id: string) => Note | undefined
  createNote: (data: CreateNoteInput) => Note
  updateNote: (
    id: string,
    data: UpdateNoteInput
  ) => void
  deleteNote: (id: string) => void
  toggleFavorite: (id: string) => void
  markAsShared: (id: string) => void
}

export const NotesContext =
  createContext<NotesContextType | null>(null)

type NotesProviderProps = {
  children: ReactNode
}

const STORAGE_KEY = 'vaultnote_notes'

const createPreview = (
  content: string
): string => {
  const cleanContent = content
    .replace(/\s+/g, ' ')
    .trim()

  if (cleanContent.length <= 140) {
    return cleanContent
  }

  return `${cleanContent.slice(0, 140)}...`
}

const formatDate = (): string => {
  return new Date().toISOString()
}

const demoNotes: Note[] = [
  {
    id: 'demo-1',
    title: 'Welcome to VaultNote',
    content:
      'This is your private encrypted notes space. Your note content is designed to be encrypted before it reaches the server.',
    preview:
      'This is your private encrypted notes space. Your note content is designed to be encrypted before it reaches the server.',
    createdAt: formatDate(),
    updatedAt: formatDate(),
    isFavorite: true,
    isShared: false,
    isEncrypted: true,
  },
  {
    id: 'demo-2',
    title: 'Project Ideas',
    content:
      'Ideas and technical concepts that I want to explore later.',
    preview:
      'Ideas and technical concepts that I want to explore later.',
    createdAt: formatDate(),
    updatedAt: formatDate(),
    isFavorite: false,
    isShared: false,
    isEncrypted: true,
  },
]

function NotesProvider({
  children,
}: NotesProviderProps) {
  const [notes, setNotes] =
    useState<Note[]>([])

  const [loading, setLoading] =
    useState(true)

  const [searchQuery, setSearchQuery] =
    useState('')

  // Restore notes
  useEffect(() => {
    try {
      const storedNotes =
        localStorage.getItem(STORAGE_KEY)

      if (storedNotes) {
        const parsedNotes: Note[] =
          JSON.parse(storedNotes)

        setNotes(parsedNotes)
      } else {
        setNotes(demoNotes)
      }
    } catch (error) {
      console.error(
        'Failed to load notes:',
        error
      )

      setNotes(demoNotes)
    } finally {
      setLoading(false)
    }
  }, [])

  // Persist notes
  useEffect(() => {
    if (loading) {
      return
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notes)
      )
    } catch (error) {
      console.error(
        'Failed to save notes:',
        error
      )
    }
  }, [notes, loading])

  // Get one note
  const getNote = (
    id: string
  ): Note | undefined => {
    return notes.find(
      (note) => note.id === id
    )
  }

  // Create note
  const createNote = (
    data: CreateNoteInput
  ): Note => {
    const now = formatDate()

    const newNote: Note = {
      id: crypto.randomUUID(),
      title:
        data.title.trim() ||
        'Untitled Note',
      content: data.content,
      preview: createPreview(
        data.content
      ),
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
      isShared: false,
      isEncrypted: true,
    }

    setNotes((currentNotes) => [
      newNote,
      ...currentNotes,
    ])

    return newNote
  }

  // Update note
  const updateNote = (
    id: string,
    data: UpdateNoteInput
  ) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) => {
        if (note.id !== id) {
          return note
        }

        const updatedTitle =
          data.title !== undefined
            ? data.title.trim() ||
              'Untitled Note'
            : note.title

        const updatedContent =
          data.content !== undefined
            ? data.content
            : note.content

        return {
          ...note,
          title: updatedTitle,
          content: updatedContent,
          preview:
            data.content !== undefined
              ? createPreview(
                  updatedContent
                )
              : note.preview,
          updatedAt: formatDate(),
        }
      })
    )
  }

  // Delete note
  const deleteNote = (id: string) => {
    setNotes((currentNotes) =>
      currentNotes.filter(
        (note) => note.id !== id
      )
    )
  }

  // Favorite
  const toggleFavorite = (id: string) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              isFavorite:
                !note.isFavorite,
              updatedAt: formatDate(),
            }
          : note
      )
    )
  }

  // Mark shared
  const markAsShared = (id: string) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              isShared: true,
              updatedAt: formatDate(),
            }
          : note
      )
    )
  }

  // Search
  const filteredNotes = useMemo(() => {
    const query =
      searchQuery
        .trim()
        .toLowerCase()

    if (!query) {
      return notes
    }

    return notes.filter((note) => {
      const title =
        note.title.toLowerCase()

      const preview =
        note.preview.toLowerCase()

      return (
        title.includes(query) ||
        preview.includes(query)
      )
    })
  }, [notes, searchQuery])

  const value: NotesContextType = {
    notes,
    loading,
    searchQuery,
    setSearchQuery,
    filteredNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    markAsShared,
  }

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  )
}

export default NotesProvider