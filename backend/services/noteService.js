const db = require('../config/database')

function createNote(userId, encryptedTitle, encryptedContent) {
  const result = db.prepare(`
    INSERT INTO notes (
      user_id,
      encrypted_title,
      encrypted_content
    )
    VALUES (?, ?, ?)
  `).run(
    userId,
    encryptedTitle,
    encryptedContent
  )

  return db.prepare(`
    SELECT id, encrypted_title, encrypted_content,
           created_at, updated_at
    FROM notes
    WHERE id = ? AND user_id = ?
  `).get(result.lastInsertRowid, userId)
}

function getNotes(userId) {
  return db.prepare(`
    SELECT id, encrypted_title, encrypted_content,
           created_at, updated_at
    FROM notes
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `).all(userId)
}

function getNoteById(userId, noteId) {
  return db.prepare(`
    SELECT id, encrypted_title, encrypted_content,
           created_at, updated_at
    FROM notes
    WHERE id = ? AND user_id = ?
  `).get(noteId, userId)
}

function updateNote(
  userId,
  noteId,
  encryptedTitle,
  encryptedContent
) {
  const result = db.prepare(`
    UPDATE notes
    SET encrypted_title = ?,
        encrypted_content = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(
    encryptedTitle,
    encryptedContent,
    noteId,
    userId
  )

  if (result.changes === 0) {
    return null
  }

  return getNoteById(userId, noteId)
}

function deleteNote(userId, noteId) {
  const result = db.prepare(`
    DELETE FROM notes
    WHERE id = ? AND user_id = ?
  `).run(noteId, userId)

  return result.changes > 0
}

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
}