const express = require('express')
const cors = require('cors')

const authRoutes =
  require('./routes/authRoutes')

const noteRoutes =
  require('./routes/noteRoutes')

const app = express()

const PORT = 5000

app.use(
  cors({
    origin: true,
    credentials: true
  })
)

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'VaultNote Backend',
    status: 'online'
  })
})

app.use(
  '/api/auth',
  authRoutes
)

app.use(
  '/api/notes',
  noteRoutes
)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  })
})

app.use(
  (error, req, res, next) => {
    console.error(error)

    res.status(500).json({
      success: false,
      message:
        error.message ||
        'Internal server error'
    })
  }
)

app.listen(PORT, () => {
  console.log(
    `VaultNote Backend running on port ${PORT}`
  )
})