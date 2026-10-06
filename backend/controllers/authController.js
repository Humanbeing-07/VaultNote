const {
  registerUser,
  loginUser
} = require('../services/authService')

function register(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      })
    }

    const user = registerUser(
      email.trim().toLowerCase(),
      password
    )

    return res.status(201).json({
      success: true,
      user
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    const result = loginUser(
      email.trim().toLowerCase(),
      password
    )

    return res.json({
      success: true,
      ...result
    })
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  register,
  login
}