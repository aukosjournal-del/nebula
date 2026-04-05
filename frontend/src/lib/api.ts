const BASE_URL = '/api/v1'

export function getToken(): string | null {
  return localStorage.getItem('lumina_token')
}

export function setToken(token: string): void {
  localStorage.setItem('lumina_token', token)
}

export function removeToken(): void {
  localStorage.removeItem('lumina_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    removeToken()
    window.location.href = '/login'
    throw new Error('Non autorisé')
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Erreur réseau' }))
    throw new Error(error.error || 'Requête échouée')
  }

  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
}
