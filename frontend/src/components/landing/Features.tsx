import { Bot, Activity, Terminal, Settings, Users, BarChart2, Globe, Zap, Bell, Key } from 'lucide-react'

const FEATURES = [
  {
    icon: Bot,
    title: 'Multi-tenant fleet',
    desc: 'Manage dozens of OpenClaw instances across different servers from a single dashboard. Full isolation per user.',
    color: 'violet',
  },
  {
    icon: Activity,
    title: 'Real-time log streaming',
    desc: 'WebSocket-based live logs from every agent. Filter by level, search full text, auto-scroll, download as file.',
    color: 'green',
  },
  {
    icon: Terminal,
    title: 'SSH command runner',
    desc: 'Execute shell commands on any agent directly from the dashboard. No terminal required. Full output capture.',
    color: 'blue',
  },
  {
    icon: Settings,
    title: 'Live config editor',
    desc: 'Edit agent configuration in a JSON editor and apply changes instantly. Gateway restarts automatically.',
    color: 'amber',
  },
  {
    icon: Users,
    title: 'Team management',
    desc: 'Invite team members with role-based access: Owner, Admin, or Viewer. Full audit trail of all actions.',
    color: 'violet',
  },
  {
    icon: BarChart2,
    title: 'Analytics & metrics',
    desc: 'Message volume, model usage breakdown, session counts, and fleet health metrics with time-series charts.',
    color: 'blue',
  },
  {
    icon: Globe,
    title: 'Public status page',
    desc: 'Share a public status page showing your fleet uptime and health. Customize with your own branding.',
    color: 'green',
  },
  {
    icon: Zap,
    title: 'Channel viewer',
    desc: 'See all Telegram and Discord channels connected to each agent. Monitor session counts and message rates.',
    color: 'amber',
  },
  {
    icon: Bell,
    title: 'Smart notifications',
    desc: 'Alert rules for agent down, high CPU, rate limits, and more. Deliver via email, Slack, Discord, or webhook.',
    color: 'red',
  },
  {
    icon: Key,
    title: 'API access',
    desc: 'Full REST API with API key authentication. Automate fleet management from CI/CD pipelines or scripts.',
    color: 'violet',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
}

export function Features() {
  return (
    <section className="py-20 px-6" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">Features</p>
          <h2 className="text-3xl font-bold text-white">Everything you need to run a fleet</h2>
          <p className="text-sm text-zinc-500 max-w-lg mx-auto">
            Built for DevOps teams managing AI agents in production. No fluff, just the tools you actually need.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {FEATURES.map((f) => {
            const c = colorMap[f.color]
            const Icon = f.icon
            return (
              <div key={f.title} className="bg-surface-1 border border-border-1 rounded-xl p-4 hover:border-border-2 transition-colors group">
                <div className={`w-8 h-8 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center mb-3`}>
                  <Icon size={14} className={c.text} />
                </div>
                <h3 className="text-xs font-bold text-white mb-1.5 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                <p className="text-2xs text-zinc-600 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
