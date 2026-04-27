export interface User {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string
}

export interface AgentStatus {
  id: string
  name: string
  ip: string
  model: string
  accent: string
  description: string | null
  active: boolean
  pid: number | null
  uptime: string | null
  last_log_lines: string[]
  created_at: string
}

export interface CreateAgentForm {
  name: string
  ip: string
  ssh_key_content: string
  gateway_token: string
  model: string
  accent: string
  description: string
}

export interface ActivityItem {
  id: string
  action: string
  detail: string | null
  created_at: string
  agent_name: string | null
}

export interface SystemStats {
  cpu: string
  memory: string
  uptime: string
}

export interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  secret?: string | null
  enabled: boolean
  created_at?: string
}

export interface NotificationRule {
  id: string
  event_type: string
  destination: string
  enabled: boolean
  threshold?: string | null
  created_at?: string
}

export interface TeamMember {
  id: string
  email: string
  name: string | null
  role: string
  status: string
  created_at: string
}
