import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import { Bell, Search } from 'lucide-react'
import { Button } from '../ui/Button'

const titles: Record<string, { title: string; desc: string }> = {
  '/app': { title: 'Overview', desc: 'All agents at a glance' },
  '/app/agents': { title: 'Agents', desc: 'Manage your OpenClaw instances' },
  '/app/logs': { title: 'Live Logs', desc: 'Real-time log streaming' },
  '/app/activity': { title: 'Activity', desc: 'Recent actions and events' },
  '/app/boards': { title: 'Boards', desc: 'Plan and coordinate agent work' },
  '/app/approvals': { title: 'Approvals', desc: 'Human review queue' },
  '/app/team': { title: 'Team', desc: 'Members, invites, and permissions' },
  '/app/skills': { title: 'Skills', desc: 'Marketplace and installed capabilities' },
  '/app/channels': { title: 'Channels', desc: 'Fleet channel inventory' },
  '/app/sessions': { title: 'Sessions', desc: 'Active conversations across agents' },
  '/app/config': { title: 'Config', desc: 'Compare and apply agent configuration' },
  '/app/analytics': { title: 'Analytics', desc: 'Operational metrics and trends' },
  '/app/notifications': { title: 'Notifications', desc: 'Alert rules and destinations' },
  '/app/webhooks': { title: 'Webhooks', desc: 'Outbound automation endpoints' },
  '/app/status': { title: 'Status Page', desc: 'Public fleet health surface' },
  '/app/organization': { title: 'Organization', desc: 'Workspace profile and plan' },
  '/app/settings': { title: 'Settings', desc: 'Account and preferences' },
}

interface Props {
  onCommandOpen?: () => void
}

export function Header({ onCommandOpen }: Props) {
  const { pathname } = useLocation()
  const { user } = useAuthStore()
  const page = titles[pathname] ?? { title: 'ClawDesk', desc: '' }

  return (
    <header className="h-12 flex items-center gap-4 px-5 border-b border-border-1 bg-surface-1 flex-shrink-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-white">{page.title}</h1>
          {page.desc && <span className="text-zinc-600 text-xs hidden sm:block">— {page.desc}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="xs" className="text-zinc-500" onClick={onCommandOpen}>
          <Search size={13} /> <span className="hidden md:block text-2xs">Search</span>
          <kbd className="hidden md:block text-2xs bg-surface-3 border border-border-1 px-1 rounded ml-1">⌘K</kbd>
        </Button>
        <Button variant="ghost" size="xs"><Bell size={13} /></Button>
        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)' }}>
          <span className="text-2xs font-bold text-white">{user?.name[0]?.toUpperCase()}</span>
        </div>
      </div>
    </header>
  )
}
