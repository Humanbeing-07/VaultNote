const noteService = require('../services/noteService')

function createNote(req, res) {
  try {
    const {
      encryptedTitle,
      encryptedContent
    } = req.body

    if (!encryptedTitle || !encryptedContent) {
      return res.status(400).json({
        success: false,
        message: 'Encrypted title and content are required'
      })
    }

    const note = noteService.createNote(
      req.user.id,
      encryptedTitle,
      encryptedContent
    )

    res.status(201).json({
      success: true,
      note
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

function getNotes(req, res) {
  try {
    const notes = noteService.getNotes(req.user.id)

    res.json({
      success: true,
      notes
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

function getNote(req, res) {
  try {
    const note = noteService.getNoteById(
      req.user.id,
      Number(req.params.id)
    )

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    res.json({
      success: true,
      note
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

function updateNote(req, res) {
  try {
    const {
      encryptedTitle,
      encryptedContent
    } = req.body

    const note = noteService.updateNote(
      req.user.id,
      Number(req.params.id),
      encryptedTitle,
      encryptedContent
    )

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    res.json({
      success: true,
      note
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

function deleteNote(req, res) {
  try {
    const deleted = noteService.deleteNote(
      req.user.id,
      Number(req.params.id)
    )

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    res.json({
      success: true,
      message: 'Note deleted'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
}