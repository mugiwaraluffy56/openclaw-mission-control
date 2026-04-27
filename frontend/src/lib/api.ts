import { AgentStatus, CreateAgentForm, ActivityItem, SystemStats, User } from '../types'

const BASE = '/api'

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('mc_token')
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText)
    throw new Error(err || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  auth: {
    signup: (email: string, password: string, name: string) =>
      req<{ token: string; user: User }>('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
    login: (email: string, password: string) =>
      req<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => req<User>('/auth/me'),
  },
  agents: {
    list: () => req<AgentStatus[]>('/agents'),
    get: (id: string) => req<AgentStatus>(`/agents/${id}`),
    create: (data: CreateAgentForm) => req<AgentStatus>('/agents', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<CreateAgentForm>) =>
      req<{ success: boolean }>(`/agents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => req<{ success: boolean }>(`/agents/${id}`, { method: 'DELETE' }),
    restart: (id: string) => req<{ success: boolean }>(`/agents/${id}/restart`, { method: 'POST' }),
    stop: (id: string) => req<{ success: boolean }>(`/agents/${id}/stop`, { method: 'POST' }),
    start: (id: string) => req<{ success: boolean }>(`/agents/${id}/start`, { method: 'POST' }),
    getConfig: (id: string) => req<Record<string, unknown>>(`/agents/${id}/config`),
    updateConfig: (id: string, config: unknown) =>
      req<{ success: boolean }>(`/agents/${id}/config`, { method: 'PUT', body: JSON.stringify(config) }),
    getSessions: (id: string) => req<Record<string, unknown>>(`/agents/${id}/sessions`),
    getStats: (id: string) => req<SystemStats>(`/agents/${id}/stats`),
  },
  activity: {
    list: () => req<ActivityItem[]>('/activity'),
  },
}

export function wsLogsUrl(agentId: string): string {
  const token = localStorage.getItem('mc_token') ?? ''
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${window.location.host}/ws/logs/${agentId}?token=${token}`
}
