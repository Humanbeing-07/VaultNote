const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const db = require('../config/database')

const JWT_SECRET =
  process.env.JWT_SECRET || 'vaultnote-dev-secret'

function generateEncryptionSalt() {
  return crypto.randomBytes(16).toString('base64')
}

function registerUser(email, password) {
  const existingUser = db
    .prepare(
      'SELECT id FROM users WHERE email = ?'
    )
    .get(email)

  if (existingUser) {
    throw new Error(
      'Email already registered'
    )
  }

  const passwordHash =
    bcrypt.hashSync(password, 12)

  const encryptionSalt =
    generateEncryptionSalt()

  const result = db
    .prepare(`
      INSERT INTO users (
        email,
        password_hash,
        encryption_salt
      )
      VALUES (?, ?, ?)
    `)
    .run(
      email,
      passwordHash,
      encryptionSalt
    )

  return {
    id: result.lastInsertRowid,
    email,
    encryptionSalt
  }
}

function loginUser(email, password) {
  const user = db
    .prepare(`
      SELECT
        id,
        email,
        password_hash,
        encryption_salt
      FROM users
      WHERE email = ?
    `)
    .get(email)

  if (!user) {
    throw new Error(
      'Invalid email or password'
    )
  }

  const validPassword =
    bcrypt.compareSync(
      password,
      user.password_hash
    )

  if (!validPassword) {
    throw new Error(
      'Invalid email or password'
    )
  }

  if (!user.encryption_salt) {
    const encryptionSalt =
      generateEncryptionSalt()

    db.prepare(`
      UPDATE users
      SET encryption_salt = ?
      WHERE id = ?
    `).run(
      encryptionSalt,
      user.id
    )

    user.encryption_salt =
      encryptionSalt
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      encryptionSalt:
        user.encryption_salt
    }
  }
}

module.exports = {
  registerUser,
  loginUser
}