/**
 * ClawDesk SDK — TypeScript client for the ClawDesk API
 */

export interface ClawDeskOptions {
  baseUrl: string
  token: string
}

export interface AgentStatus {
  id: string; name: string; ip: string; model: string
  accent: string; active: boolean; pid: number | null
  uptime: string | null; last_log_lines: string[]; created_at: string
}

export class ClawDeskClient {
  private baseUrl: string
  private token: string

  constructor(opts: ClawDeskOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/$/, '')
    this.token = opts.token
  }

  private async req<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}/api${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}`, ...init?.headers },
    })
    if (!res.ok) throw new Error(`ClawDesk API error ${res.status}`)
    return res.json()
  }

  agents = {
    list: () => this.req<AgentStatus[]>('/agents'),
    get: (id: string) => this.req<AgentStatus>(`/agents/${id}`),
    restart: (id: string) => this.req<{ success: boolean }>(`/agents/${id}/restart`, { method: 'POST' }),
    stop: (id: string) => this.req<{ success: boolean }>(`/agents/${id}/stop`, { method: 'POST' }),
    start: (id: string) => this.req<{ success: boolean }>(`/agents/${id}/start`, { method: 'POST' }),
    runCommand: (id: string, command: string) =>
      this.req<{ success: boolean; stdout: string; stderr: string }>(`/agents/${id}/command`, { method: 'POST', body: JSON.stringify({ command }) }),
    getConfig: (id: string) => this.req<Record<string, unknown>>(`/agents/${id}/config`),
    updateConfig: (id: string, config: unknown) =>
      this.req<{ success: boolean }>(`/agents/${id}/config`, { method: 'PUT', body: JSON.stringify(config) }),
    getStats: (id: string) => this.req<{ cpu: string; memory: string; uptime: string }>(`/agents/${id}/stats`),
  }

  health = () => this.req<{ ok: boolean; service: string; version: string }>('/health')
}

export default ClawDeskClient
