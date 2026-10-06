/**
 * Check whether a value is a non-empty string.
 */
export function isRequired(
  value: string
): boolean {
  return value.trim().length > 0
}

/**
 * Validate email format.
 */
export function isValidEmail(
  email: string
): boolean {
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailPattern.test(
    email.trim()
  )
}

/**
 * Validate password length.
 */
export function isValidPassword(
  password: string
): boolean {
  return password.length >= 6
}

/**
 * Validate password confirmation.
 */
export function passwordsMatch(
  password: string,
  confirmPassword: string
): boolean {
  return (
    password === confirmPassword
  )
}

/**
 * Validate note title.
 */
export function isValidNoteTitle(
  title: string
): boolean {
  const trimmedTitle =
    title.trim()

  return (
    trimmedTitle.length > 0 &&
    trimmedTitle.length <= 200
  )
}

/**
 * Validate note content.
 */
export function isValidNoteContent(
  content: string
): boolean {
  return content.trim().length > 0
}

/**
 * Validate recipient email.
 */
export function isValidRecipientEmail(
  email: string
): boolean {
  return isValidEmail(email)
}

/**
 * Get validation error for email.
 */
export function getEmailError(
  email: string
): string | null {
  if (!email.trim()) {
    return 'Email is required.'
  }

  if (!isValidEmail(email)) {
    return 'Please enter a valid email address.'
  }

  return null
}

/**
 * Get validation error for password.
 */
export function getPasswordError(
  password: string
): string | null {
  if (!password) {
    return 'Password is required.'
  }

  if (!isValidPassword(password)) {
    return 'Password must contain at least 6 characters.'
  }

  return null
}

/**
 * Get validation error for note title.
 */
export function getNoteTitleError(
  title: string
): string | null {
  if (!title.trim()) {
    return 'Note title is required.'
  }

  if (title.trim().length > 200) {
    return 'Note title cannot exceed 200 characters.'
  }

  return null
}

/**
 * Get validation error for note content.
 */
export function getNoteContentError(
  content: string
): string | null {
  if (!content.trim()) {
    return 'Note content is required.'
  }

  return null
}

/**
 * Validate a complete registration form.
 */
export function validateRegistration(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Record<string, string> {
  const errors: Record<
    string,
    string
  > = {}

  if (!name.trim()) {
    errors.name =
      'Name is required.'
  }

  const emailError =
    getEmailError(email)

  if (emailError) {
    errors.email = emailError
  }

  const passwordError =
    getPasswordError(password)

  if (passwordError) {
    errors.password =
      passwordError
  }

  if (
    password !== confirmPassword
  ) {
    errors.confirmPassword =
      'Passwords do not match.'
  }

  return errors
}

/**
 * Validate login form.
 */
export function validateLogin(
  email: string,
  password: string
): Record<string, string> {
  const errors: Record<
    string,
    string
  > = {}

  const emailError =
    getEmailError(email)

  if (emailError) {
    errors.email = emailError
  }

  const passwordError =
    getPasswordError(password)

  if (passwordError) {
    errors.password =
      passwordError
  }

  return errors
}

/**
 * Check whether validation
 * returned any errors.
 */
export function hasValidationErrors(
  errors: Record<string, string>
): boolean {
  return (
    Object.keys(errors).length > 0
  )
}