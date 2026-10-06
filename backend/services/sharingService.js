const db = require('../config/database')

function createShare(
  noteId,
  ownerId,
  recipientEmail,
  encryptedKey = null,
  permission = 'read'
) {
  const note = db
    .prepare(`
      SELECT id
      FROM notes
      WHERE id = ? AND user_id = ?
    `)
    .get(noteId, ownerId)

  if (!note) {
    throw new Error(
      'Note not found or you are not the owner'
    )
  }

  const recipient = db
    .prepare(`
      SELECT id, email
      FROM users
      WHERE email = ?
    `)
    .get(recipientEmail)

  if (!recipient) {
    throw new Error(
      'Recipient user is not registered'
    )
  }

  if (recipient.id === ownerId) {
    throw new Error(
      'You cannot share a note with yourself'
    )
  }

  const existing = db
    .prepare(`
      SELECT id
      FROM shares
      WHERE note_id = ?
        AND owner_id = ?
        AND recipient_email = ?
        AND revoked = 0
    `)
    .get(
      noteId,
      ownerId,
      recipientEmail
    )

  if (existing) {
    throw new Error(
      'This note is already shared with this user'
    )
  }

  const result = db
    .prepare(`
      INSERT INTO shares (
        note_id,
        owner_id,
        recipient_email,
        encrypted_key,
        permission
      )
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(
      noteId,
      ownerId,
      recipientEmail,
      encryptedKey,
      permission
    )

  db.prepare(`
    INSERT INTO audit_logs (
      user_id,
      action,
      note_id
    )
    VALUES (?, ?, ?)
  `).run(
    ownerId,
    'NOTE_SHARED',
    noteId
  )

  return db
    .prepare(`
      SELECT *
      FROM shares
      WHERE id = ?
    `)
    .get(result.lastInsertRowid)
}

function getShares(noteId, ownerId) {
  return db
    .prepare(`
      SELECT
        id,
        note_id,
        recipient_email,
        permission,
        revoked,
        created_at,
        revoked_at
      FROM shares
      WHERE note_id = ?
        AND owner_id = ?
      ORDER BY created_at DESC
    `)
    .all(noteId, ownerId)
}

function revokeShare(
  shareId,
  ownerId
) {
  const share = db
    .prepare(`
      SELECT *
      FROM shares
      WHERE id = ?
        AND owner_id = ?
    `)
    .get(
      shareId,
      ownerId
    )

  if (!share) {
    throw new Error(
      'Share not found or you are not the owner'
    )
  }

  if (share.revoked) {
    throw new Error(
      'Share is already revoked'
    )
  }

  db.prepare(`
    UPDATE shares
    SET
      revoked = 1,
      revoked_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(shareId)

  db.prepare(`
    INSERT INTO audit_logs (
      user_id,
      action,
      note_id
    )
    VALUES (?, ?, ?)
  `).run(
    ownerId,
    'SHARE_REVOKED',
    share.note_id
  )

  return {
    success: true,
    shareId
  }
}

function getSharedNotes(
  userEmail
) {
  return db
    .prepare(`
      SELECT
        n.id,
        n.encrypted_title,
        n.encrypted_content,
        n.created_at,
        n.updated_at,
        s.id AS share_id,
        s.permission,
        s.encrypted_key,
        s.created_at AS shared_at
      FROM shares s
      INNER JOIN notes n
        ON n.id = s.note_id
      WHERE s.recipient_email = ?
        AND s.revoked = 0
      ORDER BY s.created_at DESC
    `)
    .all(userEmail)
}

module.exports = {
  createShare,
  getShares,
  revokeShare,
  getSharedNotes
}