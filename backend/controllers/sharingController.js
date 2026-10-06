const {
  createShare,
  getShares,
  revokeShare,
  getSharedNotes
} = require('../services/sharingService')

function shareNote(req, res) {
  try {
    const ownerId = req.user.id

    const {
      noteId,
      recipientEmail,
      encryptedKey,
      permission
    } = req.body

    if (!noteId) {
      return res.status(400).json({
        success: false,
        message: 'Note ID is required'
      })
    }

    if (!recipientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email is required'
      })
    }

    const share = createShare(
      noteId,
      ownerId,
      recipientEmail
        .trim()
        .toLowerCase(),
      encryptedKey || null,
      permission || 'read'
    )

    return res.status(201).json({
      success: true,
      share
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

function listShares(req, res) {
  try {
    const ownerId = req.user.id
    const { noteId } = req.params

    const shares =
      getShares(
        noteId,
        ownerId
      )

    return res.json({
      success: true,
      shares
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

function revokeNoteShare(req, res) {
  try {
    const ownerId = req.user.id
    const { shareId } = req.params

    const result =
      revokeShare(
        shareId,
        ownerId
      )

    return res.json(result)
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

function sharedNotes(req, res) {
  try {
    const email =
      req.user.email

    const notes =
      getSharedNotes(email)

    return res.json({
      success: true,
      notes
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  shareNote,
  listShares,
  revokeNoteShare,
  sharedNotes
}