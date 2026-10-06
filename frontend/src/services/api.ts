const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'

type RequestOptions = {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
  } = options

  const token =
    localStorage.getItem('vaultnote_token')

  const requestHeaders: Record<string, string> = {
    ...headers,
  }

  if (body !== undefined) {
    requestHeaders['Content-Type'] =
      'application/json'
  }

  if (token) {
    requestHeaders['Authorization'] =
      `Bearer ${token}`
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method,
      headers: requestHeaders,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }
  )

  let result: ApiResponse<T> | null = null

  try {
    result = await response.json()
  } catch {
    result = null
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
        `Request failed with status ${response.status}`
    )
  }

  if (
    result &&
    result.success === false
  ) {
    throw new Error(
      result.message ||
        'API request failed.'
    )
  }

  return (
    result?.data ??
    (result as T)
  ) as T
}

export async function apiGet<T>(
  endpoint: string
): Promise<T> {
  return request<T>(endpoint)
}

export async function apiPost<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body,
  })
}

export async function apiPut<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    body,
  })
}

export async function apiPatch<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  return request<T>(endpoint, {
    method: 'PATCH',
    body,
  })
}

export async function apiDelete<T>(
  endpoint: string
): Promise<T> {
  return request<T>(endpoint, {
    method: 'DELETE',
  })
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiGet('/health')
    return true
  } catch (error) {
    console.error(
      'API health check failed:',
      error
    )

    return false
  }
}

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
  health: checkApiHealth,
}