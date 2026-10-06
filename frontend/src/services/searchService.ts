export type SearchableNote = {
  id: string
  title: string
  content: string
  preview?: string
}

/**
 * Search notes locally.
 *
 * Important:
 * VaultNote uses end-to-end encryption.
 * Therefore plaintext search should happen
 * on the user's device after decryption.
 *
 * The server should never receive the
 * plaintext search query.
 */
export function searchNotes(
  notes: SearchableNote[],
  query: string
): SearchableNote[] {
  const normalizedQuery =
    query.trim().toLowerCase()

  if (!normalizedQuery) {
    return notes
  }

  return notes.filter((note) => {
    const title =
      note.title.toLowerCase()

    const content =
      note.content.toLowerCase()

    const preview =
      note.preview?.toLowerCase() || ''

    return (
      title.includes(normalizedQuery) ||
      content.includes(normalizedQuery) ||
      preview.includes(normalizedQuery)
    )
  })
}

/**
 * Search notes using multiple keywords.
 *
 * Example:
 * "project security"
 *
 * Both keywords must be present somewhere
 * in the note.
 */
export function searchNotesByKeywords(
  notes: SearchableNote[],
  query: string
): SearchableNote[] {
  const keywords = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  if (keywords.length === 0) {
    return notes
  }

  return notes.filter((note) => {
    const searchableText = [
      note.title,
      note.content,
      note.preview || '',
    ]
      .join(' ')
      .toLowerCase()

    return keywords.every(
      (keyword) =>
        searchableText.includes(keyword)
    )
  })
}

/**
 * Highlight matching text in the UI.
 *
 * This function only returns text parts.
 * The React component can decide how
 * matching parts should be rendered.
 */
export function getSearchMatches(
  text: string,
  query: string
): {
  text: string
  matched: boolean
}[] {
  const normalizedQuery =
    query.trim()

  if (!normalizedQuery) {
    return [
      {
        text,
        matched: false,
      },
    ]
  }

  const lowerText =
    text.toLowerCase()

  const lowerQuery =
    normalizedQuery.toLowerCase()

  const result: {
    text: string
    matched: boolean
  }[] = []

  let currentIndex = 0

  while (true) {
    const matchIndex =
      lowerText.indexOf(
        lowerQuery,
        currentIndex
      )

    if (matchIndex === -1) {
      if (
        currentIndex <
        text.length
      ) {
        result.push({
          text: text.slice(
            currentIndex
          ),
          matched: false,
        })
      }

      break
    }

    if (
      matchIndex >
      currentIndex
    ) {
      result.push({
        text: text.slice(
          currentIndex,
          matchIndex
        ),
        matched: false,
      })
    }

    result.push({
      text: text.slice(
        matchIndex,
        matchIndex +
          normalizedQuery.length
      ),
      matched: true,
    })

    currentIndex =
      matchIndex +
      normalizedQuery.length
  }

  return result
}