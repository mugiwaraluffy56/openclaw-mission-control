import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from 'recharts'
import { AlertTriangle, Bell, Bot, Check, ClipboardCheck, Code2, Columns3, CreditCard, GitBranch, Globe, Key, Layers, Link2, Lock, MailPlus, Plug, Plus, Save, Search, Settings, Shield, SlidersHorizontal, Trash2, Users, Webhook, X } from 'lucide-react'
import toast from 'react-hot-toast'

import { api } from '../../lib/api'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { DataTable, Column } from '../../components/ui/DataTable'
import { Input } from '../../components/ui/Input'
import { Progress } from '../../components/ui/Progress'
import { StatusDot } from '../../components/ui/StatusDot'
import { Switch } from '../../components/ui/Switch'
import { AgentStatus, NotificationRule, TeamMember, WebhookConfig } from '../../types'

const timeline = [
  { t: '00:00', messages: 220, errors: 4, uptime: 99.98 },
  { t: '04:00', messages: 310, errors: 7, uptime: 99.95 },
  { t: '08:00', messages: 680, errors: 12, uptime: 99.91 },
  { t: '12:00', messages: 920, errors: 9, uptime: 99.96 },
  { t: '16:00', messages: 740, errors: 6, uptime: 99.97 },
  { t: '20:00', messages: 430, errors: 3, uptime: 99.99 },
]

const skills = [
  { name: 'Gateway Supervisor', version: '2.4.1', author: 'OpenClaw', category: 'Runtime', installed: true },
  { name: 'Discord Router', version: '1.8.0', author: 'OpenClaw', category: 'Channel', installed: true },
  { name: 'Telegram Router', version: '1.6.3', author: 'OpenClaw', category: 'Channel', installed: false },
  { name: 'Filesystem Guard', version: '0.9.7', author: 'Security Lab', category: 'Policy', installed: false },
  { name: 'Model Budgeter', version: '1.2.2', author: 'OpsKit', category: 'Cost', installed: false },
  { name: 'Incident Summarizer', version: '3.0.0', author: 'OpenClaw', category: 'Ops', installed: true },
]

function PageShell({ title, eyebrow, actions, children }: { title: string; eyebrow: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-2xs uppercase tracking-wider text-zinc-600">{eyebrow}</div>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}

function DenseMetric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-surface-1 border border-border-1 rounded-lg px-3 py-2">
      <div className="text-2xs uppercase tracking-wider text-zinc-600">{label}</div>
      <div className="text-xl font-semibold font-mono text-white leading-tight">{value}</div>
      <div className="text-2xs text-zinc-600">{sub}</div>
    </div>
  )
}

function Toolbar({ search, setSearch, filters }: { search: string; setSearch: (v: string) => void; filters?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-surface-1 border border-border-1 rounded-lg p-2">
      <div className="flex items-center gap-2 min-w-64 flex-1 bg-surface-0 border border-border-1 rounded-md px-2 h-8">
        <Search size={13} className="text-zinc-600" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 bg-transparent outline-none text-xs text-zinc-200 placeholder-zinc-700" />
      </div>
      {filters}
      <Button variant="ghost" size="xs"><SlidersHorizontal size={12} /> Filters</Button>
    </div>
  )
}

export function Boards() {
  const columns = [
    { title: 'Todo', items: ['Define gateway rollback policy', 'Add Discord shard telemetry', 'Review model budget limits'] },
    { title: 'In Progress', items: ['Rotate production SSH keys', 'Profile session restore latency'] },
    { title: 'Done', items: ['Ship audit export', 'Backfill uptime snapshots'] },
  ]
  return (
    <PageShell title="Boards" eyebrow="Work orchestration" actions={<Button size="sm" variant="primary"><Plus size={13} /> Board</Button>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {columns.map((col) => (
          <div key={col.title} className="bg-surface-1 border border-border-1 rounded-lg overflow-hidden">
            <div className="px-3 py-2 border-b border-border-1 flex items-center justify-between">
              <span className="text-xs font-medium text-white">{col.title}</span>
              <Badge variant="gray">{col.items.length}</Badge>
            </div>
            <div className="p-2 space-y-2">
              {col.items.map((item, i) => (
                <div key={item} className="bg-surface-0 border border-border-1 rounded-md p-2 cursor-grab">
                  <div className="text-xs text-zinc-200">{item}</div>
                  <div className="mt-2 flex items-center justify-between text-2xs text-zinc-600">
                    <span>AG-{100 + i}</span><span>{i + 1} agents</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}

export function CreateBoard() {
  const [name, setName] = useState('')
  const { data: agents = [] } = useQuery({ queryKey: ['agents'], queryFn: api.agents.list })
  return (
    <PageShell title="Create Board" eyebrow="Board wizard" actions={<Button size="sm" variant="primary"><Save size={13} /> Create</Button>}>
      <div className="grid grid-cols-1 xl:grid-cols-[420px,1fr] gap-4">
        <div className="bg-surface-1 border border-border-1 rounded-lg p-3 space-y-3">
          <Input label="Board name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Runtime hardening" />
          <label className="block text-xs text-zinc-500">Description<textarea className="mt-1 w-full h-28 bg-surface-0 border border-border-1 rounded-lg px-3 py-2 text-xs text-white outline-none" /></label>
        </div>
        <AgentAssignment agents={agents} />
      </div>
    </PageShell>
  )
}

function AgentAssignment({ agents }: { agents: AgentStatus[] }) {
  return (
    <div className="bg-surface-1 border border-border-1 rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-border-1 text-xs font-medium">Agent assignments</div>
      {agents.map((a) => (
        <label key={a.id} className="flex items-center justify-between px-3 py-2 border-b border-border-1 last:border-0">
          <span className="flex items-center gap-2 text-xs"><StatusDot active={a.active} />{a.name}<span className="font-mono text-zinc-600">{a.ip}</span></span>
          <input type="checkbox" className="accent-violet-600" />
        </label>
      ))}
    </div>
  )
}

export function Approvals() {
  const rows = ['Restart production gateway', 'Apply config diff', 'Install Filesystem Guard', 'Revoke stale API key'].map((action, i) => ({ id: String(i), action, agent: `agent-${i + 1}`, requester: i % 2 ? 'ops@openclaw.dev' : 'admin@openclaw.dev', risk: i === 1 ? 'high' : 'medium' }))
  const cols: Column<typeof rows[number]>[] = [
    { key: 'action', header: 'Action', sortable: true, render: (r) => <span className="text-white">{r.action}</span> },
    { key: 'agent', header: 'Agent', render: (r) => <span className="font-mono">{r.agent}</span> },
    { key: 'requester', header: 'Requester', render: (r) => r.requester },
    { key: 'risk', header: 'Risk', render: (r) => <Badge variant={r.risk === 'high' ? 'red' : 'amber'}>{r.risk}</Badge> },
    { key: 'actions', header: '', render: () => <div className="flex gap-1 justify-end"><Button size="xs" variant="ghost"><Check size={12} /></Button><Button size="xs" variant="ghost"><X size={12} /></Button></div> },
  ]
  return <PageShell title="Approvals" eyebrow="Human review"><DataTable columns={cols} data={rows} getKey={(r) => r.id} /></PageShell>
}

export function Team() {
  const qc = useQueryClient()
  const [email, setEmail] = useState('')
  const { data = [] } = useQuery({ queryKey: ['team'], queryFn: api.team.list })
  const invite = useMutation({ mutationFn: () => api.team.invite(email, 'operator'), onSuccess: () => { toast.success('Invite queued'); setEmail(''); qc.invalidateQueries({ queryKey: ['team'] }) } })
  const cols: Column<TeamMember>[] = [
    { key: 'name', header: 'Member', sortable: true, render: (m) => <div><div className="text-white">{m.name ?? m.email}</div><div className="text-2xs text-zinc-600">{m.email}</div></div> },
    { key: 'role', header: 'Role', render: (m) => <Badge variant={m.role === 'owner' ? 'violet' : 'gray'}>{m.role}</Badge> },
    { key: 'status', header: 'Status', render: (m) => <Badge variant={m.status === 'active' ? 'green' : 'amber'}>{m.status}</Badge> },
    { key: 'joined', header: 'Joined', render: (m) => <span className="font-mono">{m.created_at?.slice(0, 10)}</span> },
    { key: 'actions', header: '', render: () => <Button size="xs" variant="ghost">Edit</Button> },
  ]
  return (
    <PageShell title="Team" eyebrow="Members and roles" actions={<div className="flex gap-2"><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@company.com" /><Button size="sm" variant="primary" loading={invite.isPending} onClick={() => invite.mutate()}><MailPlus size={13} /> Invite</Button></div>}>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr,360px] gap-4">
        <DataTable columns={cols} data={data} getKey={(m) => m.id} />
        <PermissionsMatrix />
      </div>
    </PageShell>
  )
}

function PermissionsMatrix() {
  const rows = ['Manage agents', 'Run commands', 'Approve changes', 'Billing', 'Team invites']
  return (
    <div className="bg-surface-1 border border-border-1 rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-border-1 text-xs font-medium">Role permissions</div>
      {rows.map((r, i) => <div key={r} className="grid grid-cols-[1fr,48px,48px,48px] px-3 py-2 border-b border-border-1 last:border-0 text-xs"><span>{r}</span><span>Own</span><span>{i < 3 ? 'Adm' : '-'}</span><span>{i < 1 ? 'Ops' : '-'}</span></div>)}
    </div>
  )
}

export function SkillsMarketplace() {
  const [search, setSearch] = useState('')
  const filtered = skills.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()))
  return (
    <PageShell title="Skills Marketplace" eyebrow="Installable capabilities">
      <Toolbar search={search} setSearch={setSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((s) => <div key={s.name} className="bg-surface-1 border border-border-1 rounded-lg p-3">
          <div className="flex items-start justify-between"><div><div className="text-sm font-medium text-white">{s.name}</div><div className="text-2xs text-zinc-600">{s.author} / {s.version}</div></div><Badge variant={s.installed ? 'green' : 'gray'}>{s.installed ? 'installed' : s.category}</Badge></div>
          <Button className="mt-3 w-full" size="xs" variant={s.installed ? 'ghost' : 'primary'}>{s.installed ? 'Manage' : 'Install'}</Button>
        </div>)}
      </div>
    </PageShell>
  )
}

export function InstalledSkills() {
  const rows = skills.filter((s) => s.installed).map((s, i) => ({ ...s, agent: `agent-${i + 1}`, health: i === 2 ? 'degraded' : 'ready' }))
  const cols: Column<typeof rows[number]>[] = [
    { key: 'name', header: 'Skill', sortable: true, render: (s) => <span className="text-white">{s.name}</span> },
    { key: 'agent', header: 'Agent', render: (s) => <span className="font-mono">{s.agent}</span> },
    { key: 'version', header: 'Version', render: (s) => <span className="font-mono">{s.version}</span> },
    { key: 'health', header: 'Health', render: (s) => <Badge variant={s.health === 'ready' ? 'green' : 'amber'}>{s.health}</Badge> },
    { key: 'actions', header: '', render: () => <div className="flex justify-end gap-1"><Button size="xs" variant="ghost">Update</Button><Button size="xs" variant="ghost">Uninstall</Button></div> },
  ]
  return <PageShell title="Installed Skills" eyebrow="Per-agent capability inventory"><DataTable columns={cols} data={rows} getKey={(r) => `${r.agent}-${r.name}`} /></PageShell>
}

export function Channels() {
  const { data: agents = [] } = useQuery({ queryKey: ['agents'], queryFn: api.agents.list })
  const rows = agents.flatMap((a, i) => ['telegram', 'discord'].map((kind) => ({ id: `${a.id}-${kind}`, kind, agent: a.name, status: a.active ? 'connected' : 'offline', last: `${2 + i}m ago` })))
  const cols: Column<typeof rows[number]>[] = [
    { key: 'kind', header: 'Channel', render: (r) => <span className="capitalize text-white">{r.kind}</span> },
    { key: 'agent', header: 'Agent', render: (r) => r.agent },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'connected' ? 'green' : 'gray'}>{r.status}</Badge> },
    { key: 'last', header: 'Last message', render: (r) => <span className="font-mono">{r.last}</span> },
  ]
  return <PageShell title="Channels" eyebrow="Telegram, Discord, and gateway endpoints"><DataTable columns={cols} data={rows} getKey={(r) => r.id} /></PageShell>
}

export function Sessions() {
  const { data: agents = [] } = useQuery({ queryKey: ['agents'], queryFn: api.agents.list })
  const rows = agents.map((a, i) => ({ id: `sess_${a.id.slice(0, 8)}`, agent: a.name, channel: i % 2 ? 'discord' : 'telegram', last: `${i + 1}m ago`, messages: 120 + i * 32 }))
  const cols: Column<typeof rows[number]>[] = [
    { key: 'id', header: 'Session key', render: (r) => <span className="font-mono text-white">{r.id}</span> },
    { key: 'agent', header: 'Agent', render: (r) => r.agent },
    { key: 'channel', header: 'Channel', render: (r) => <Badge variant="gray">{r.channel}</Badge> },
    { key: 'last', header: 'Last activity', render: (r) => <span className="font-mono">{r.last}</span> },
    { key: 'messages', header: 'Messages', render: (r) => <span className="font-mono">{r.messages}</span> },
  ]
  return <PageShell title="Sessions" eyebrow="Fleet-wide active conversations"><DataTable columns={cols} data={rows} getKey={(r) => r.id} /></PageShell>
}

export function ConfigManager() {
  const { data: agents = [] } = useQuery({ queryKey: ['agents'], queryFn: api.agents.list })
  const left = JSON.stringify({ gateway: { retries: 3, timeout_ms: 45000 }, channels: ['telegram', 'discord'], model: 'claude-sonnet' }, null, 2)
  const right = JSON.stringify({ gateway: { retries: 5, timeout_ms: 45000 }, channels: ['telegram', 'discord'], model: 'gpt-4.1' }, null, 2)
  return (
    <PageShell title="Config Manager" eyebrow="Compare and apply configs" actions={<Button size="sm" variant="primary"><Save size={13} /> Apply to selected</Button>}>
      <div className="grid grid-cols-1 xl:grid-cols-[240px,1fr,1fr] gap-3">
        <AgentAssignment agents={agents} />
        {[left, right].map((content, i) => <pre key={i} className="bg-surface-1 border border-border-1 rounded-lg p-3 overflow-auto text-xs font-mono leading-5 text-zinc-300 h-[540px]">{content}</pre>)}
      </div>
    </PageShell>
  )
}

export function Analytics() {
  const modelData = [{ name: 'Sonnet', value: 48 }, { name: 'GPT', value: 36 }, { name: 'Local', value: 16 }]
  return (
    <PageShell title="Analytics" eyebrow="Operational intelligence">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3"><DenseMetric label="Messages" value="3.3k" sub="+18.4%" /><DenseMetric label="Errors" value="41" sub="-7.2%" /><DenseMetric label="Uptime" value="99.96%" sub="30d" /><DenseMetric label="Spend" value="$184" sub="month to date" /></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <ChartCard title="Message volume"><BarChart data={timeline}><CartesianGrid stroke="#222" /><XAxis dataKey="t" /><YAxis /><ChartTooltip /><Bar dataKey="messages" fill="#8b5cf6" /></BarChart></ChartCard>
        <ChartCard title="Error rate"><LineChart data={timeline}><CartesianGrid stroke="#222" /><XAxis dataKey="t" /><YAxis /><ChartTooltip /><Line dataKey="errors" stroke="#f43f5e" /></LineChart></ChartCard>
        <ChartCard title="Model usage"><PieChart><Pie data={modelData} dataKey="value" nameKey="name" outerRadius={90}>{modelData.map((_, i) => <Cell key={i} fill={['#8b5cf6', '#22c55e', '#38bdf8'][i]} />)}</Pie><ChartTooltip /></PieChart></ChartCard>
        <ChartCard title="Agent uptime"><AreaChart data={timeline}><CartesianGrid stroke="#222" /><XAxis dataKey="t" /><YAxis domain={[99.8, 100]} /><ChartTooltip /><Area dataKey="uptime" stroke="#22c55e" fill="#22c55e33" /></AreaChart></ChartCard>
      </div>
    </PageShell>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return <div className="bg-surface-1 border border-border-1 rounded-lg p-3 h-72"><div className="text-xs font-medium text-white mb-2">{title}</div><ResponsiveContainer width="100%" height="88%">{children}</ResponsiveContainer></div>
}

export function Notifications() {
  const qc = useQueryClient()
  const { data = [] } = useQuery({ queryKey: ['notifications'], queryFn: api.notifications.list })
  const create = useMutation({ mutationFn: (event_type: string) => api.notifications.create({ event_type, destination: 'ops@openclaw.dev', enabled: true }), onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) })
  const defaults = ['agent_down', 'high_cpu', 'model_error', 'webhook_failed']
  const rows = defaults.map((event) => data.find((r) => r.event_type === event) ?? { id: event, event_type: event, destination: 'ops@openclaw.dev', enabled: false })
  const cols: Column<NotificationRule>[] = [
    { key: 'event', header: 'Event', render: (r) => <span className="font-mono text-white">{r.event_type}</span> },
    { key: 'enabled', header: 'Enabled', render: (r) => <Switch checked={r.enabled} onChange={() => !r.enabled && create.mutate(r.event_type)} /> },
    { key: 'dest', header: 'Destination', render: (r) => r.destination },
    { key: 'threshold', header: 'Threshold', render: (r) => r.threshold ?? 'default' },
  ]
  return <PageShell title="Notifications" eyebrow="Rules and destinations"><DataTable columns={cols} data={rows} getKey={(r) => r.id} /></PageShell>
}

export function Webhooks() {
  const qc = useQueryClient()
  const [url, setUrl] = useState('')
  const { data = [] } = useQuery({ queryKey: ['webhooks'], queryFn: api.webhooks.list })
  const create = useMutation({ mutationFn: () => api.webhooks.create({ name: 'Operations hook', url, events: ['agent_down', 'approval_created'], enabled: true }), onSuccess: () => { setUrl(''); qc.invalidateQueries({ queryKey: ['webhooks'] }) } })
  const remove = useMutation({ mutationFn: api.webhooks.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['webhooks'] }) })
  const cols: Column<WebhookConfig>[] = [
    { key: 'name', header: 'Name', render: (w) => <span className="text-white">{w.name}</span> },
    { key: 'url', header: 'URL', render: (w) => <span className="font-mono">{w.url}</span> },
    { key: 'events', header: 'Events', render: (w) => <span>{w.events?.join(', ')}</span> },
    { key: 'enabled', header: 'Enabled', render: (w) => <Badge variant={w.enabled ? 'green' : 'gray'}>{w.enabled ? 'on' : 'off'}</Badge> },
    { key: 'actions', header: '', render: (w) => <div className="flex justify-end gap-1"><Button size="xs" variant="ghost">Test</Button><Button size="xs" variant="ghost" onClick={() => remove.mutate(w.id)}><Trash2 size={12} /></Button></div> },
  ]
  return <PageShell title="Webhooks" eyebrow="Outbound automation" actions={<div className="flex gap-2"><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://hooks.example.com/openclaw" /><Button size="sm" variant="primary" onClick={() => create.mutate()}><Plus size={13} /> Add</Button></div>}><DataTable columns={cols} data={data} getKey={(w) => w.id} /></PageShell>
}

export function StatusPage() {
  return (
    <PageShell title="Status Page" eyebrow="Public health surface" actions={<Button size="sm" variant="primary"><Globe size={13} /> Publish</Button>}>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3"><DenseMetric label="Public page" value="ON" sub="status.openclaw.local" /><DenseMetric label="Incidents" value="0" sub="last 7d" /><DenseMetric label="SLO" value="99.9" sub="target" /><DenseMetric label="Uptime" value="99.96" sub="30d" /></div>
      <ChartCard title="Uptime history"><AreaChart data={timeline}><CartesianGrid stroke="#222" /><XAxis dataKey="t" /><YAxis domain={[99.8, 100]} /><ChartTooltip /><Area dataKey="uptime" stroke="#22c55e" fill="#22c55e33" /></AreaChart></ChartCard>
      <DataTable columns={[{ key: 'date', header: 'Date', render: (r: any) => <span className="font-mono">{r.date}</span> }, { key: 'incident', header: 'Incident', render: (r: any) => r.incident }, { key: 'status', header: 'Status', render: () => <Badge variant="green">resolved</Badge> }]} data={[{ id: '1', date: '2026-04-22', incident: 'Gateway restart latency above SLO' }]} getKey={(r: any) => r.id} />
    </PageShell>
  )
}

export function ProfileSettings() { return <SettingsPage title="Profile Settings" icon={<Users size={16} />} fields={['Display name', 'Email address', 'Timezone']} /> }
export function SecuritySettings() { return <SettingsPage title="Security" icon={<Lock size={16} />} fields={['Current password', 'New password', 'Confirm password']} extra={<DataTable columns={[{ key: 'device', header: 'Active sessions', render: (r: any) => r.device }, { key: 'last', header: 'Last used', render: (r: any) => r.last }]} data={[{ id: '1', device: 'Chrome on macOS', last: 'now' }]} getKey={(r: any) => r.id} />} /> }
export function ApiKeysSettings() { return <SettingsPage title="API Keys" icon={<Key size={16} />} fields={['Key label']} extra={<DataTable columns={[{ key: 'key', header: 'Prefix', render: () => <span className="font-mono">oc_live_7f2a...</span> }, { key: 'last', header: 'Last used', render: () => 'never' }, { key: 'act', header: '', render: () => <Button size="xs" variant="ghost">Revoke</Button> }]} data={[{ id: '1' }]} getKey={(r: any) => r.id} />} /> }
export function BillingSettings() { return <SettingsPage title="Billing" icon={<CreditCard size={16} />} fields={[]} extra={<div className="grid grid-cols-1 md:grid-cols-3 gap-3">{['Free', 'Pro', 'Team'].map((p, i) => <div key={p} className="bg-surface-1 border border-border-1 rounded-lg p-3"><div className="text-white font-medium">{p}</div><div className="text-2xs text-zinc-600">{i === 0 ? 'Current' : 'Upgrade available'}</div><Progress value={[34, 62, 12][i]} className="mt-3" /></div>)}</div>} /> }
export function NotificationSettings() { return <SettingsPage title="Notification Preferences" icon={<Bell size={16} />} fields={['Digest email', 'Escalation email']} /> }
export function Organization() { return <SettingsPage title="Organization" icon={<Shield size={16} />} fields={['Workspace name', 'Workspace slug', 'Plan']} extra={<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"><div className="text-sm text-red-300">Danger zone</div><Button className="mt-2" size="xs" variant="ghost">Delete organization</Button></div>} /> }

function SettingsPage({ title, icon, fields, extra }: { title: string; icon: React.ReactNode; fields: string[]; extra?: React.ReactNode }) {
  return (
    <PageShell title={title} eyebrow="Administration" actions={<Button size="sm" variant="primary"><Save size={13} /> Save</Button>}>
      <div className="grid grid-cols-1 xl:grid-cols-[420px,1fr] gap-4">
        <div className="bg-surface-1 border border-border-1 rounded-lg p-3 space-y-3">
          <div className="flex items-center gap-2 text-sm text-white">{icon}{title}</div>
          {fields.map((field) => <Input key={field} label={field} placeholder={field} />)}
        </div>
        <div>{extra ?? <div className="bg-surface-1 border border-border-1 rounded-lg p-3 text-xs text-zinc-500">Preferences are saved to the workspace profile and applied across Mission Control.</div>}</div>
      </div>
    </PageShell>
  )
}

export function GenericDensePage({ title, eyebrow, icon }: { title: string; eyebrow: string; icon: React.ReactNode }) {
  const [search, setSearch] = useState('')
  const rows = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ id: `${i}`, name: `${title} ${i + 1}`, owner: i % 2 ? 'runtime' : 'ops', status: i % 3 ? 'ready' : 'queued', updated: `${i + 1}m ago`, score: 70 + i })), [title])
  const filtered = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
  const cols: Column<typeof rows[number]>[] = [
    { key: 'name', header: 'Name', sortable: true, render: (r) => <span className="flex items-center gap-2 text-white">{icon}{r.name}</span> },
    { key: 'owner', header: 'Owner', render: (r) => <span className="font-mono">{r.owner}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'ready' ? 'green' : 'amber'}>{r.status}</Badge> },
    { key: 'updated', header: 'Updated', render: (r) => <span className="font-mono">{r.updated}</span> },
    { key: 'score', header: 'Score', render: (r) => <span className="font-mono">{r.score}</span> },
  ]
  return <PageShell title={title} eyebrow={eyebrow}><Toolbar search={search} setSearch={setSearch} /><DataTable columns={cols} data={filtered} getKey={(r) => r.id} /></PageShell>
}

export const BoardsIcon = <Columns3 size={13} />
export const ApprovalsIcon = <ClipboardCheck size={13} />
export const SkillsIcon = <Plug size={13} />
export const ConfigIcon = <Code2 size={13} />
export const WebhookIcon = <Webhook size={13} />
export const LayersIcon = <Layers size={13} />
export const LinkIcon = <Link2 size={13} />
export const GitIcon = <GitBranch size={13} />
export const AlertIcon = <AlertTriangle size={13} />
export const SettingsIcon = <Settings size={13} />
