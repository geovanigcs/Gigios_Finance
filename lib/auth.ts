// Funções de autenticação usando backend NestJS

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export interface User {
  id: string
  email: string
  name: string
  username: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Pegar token do localStorage
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

// Pegar usuário do localStorage
export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// Verificar se está autenticado
export function isAuthenticated(): boolean {
  return !!getToken()
}

// Fazer logout
export function logout() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  window.location.href = '/'
}

// Fazer requisição autenticada
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getToken()
  
  if (!token) {
    throw new Error('Não autenticado')
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    // Token expirado ou inválido
    logout()
    throw new Error('Sessão expirada')
  }

  return response
}
