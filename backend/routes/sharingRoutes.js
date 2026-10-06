const express = require('express')

const authMiddleware =
  require('../middleware/authMiddleware')

const {
  shareNote,
  listShares,
  revokeNoteShare,
  sharedNotes
} = require('../controllers/sharingController')

const router = express.Router()

router.use(authMiddleware)

router.post(
  '/',
  shareNote
)

router.get(
  '/received',
  sharedNotes
)

router.get(
  '/note/:noteId',
  listShares
)

router.delete(
  '/:shareId',
  revokeNoteShare
)

module.exports = router