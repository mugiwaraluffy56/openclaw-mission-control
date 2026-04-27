export type RequestOptions = {
  baseUrl: string
  token?: string
}

export class OpenClawMissionControl {
  private baseUrl: string
  private token?: string

  constructor(options: RequestOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '')
    this.token = options.token
  }

  setToken(token: string) {
    this.token = token
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...init.headers,
      },
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<T>
  }

  login(email: string, password: string) {
    return this.request<{ token: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  }

  agents() {
    return this.request('/agents')
  }

  runCommand(agentId: string, command: string) {
    return this.request(`/agents/${agentId}/command`, { method: 'POST', body: JSON.stringify({ command }) })
  }

  webhooks() {
    return this.request('/webhooks')
  }
}
