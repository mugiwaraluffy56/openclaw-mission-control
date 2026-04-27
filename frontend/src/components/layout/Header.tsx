import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import { Bell, Search } from 'lucide-react'
import { Button } from '../ui/Button'

const titles: Record<string, { title: string; desc: string }> = {
  '/app': { title: 'Overview', desc: 'All agents at a glance' },
  '/app/agents': { title: 'Agents', desc: 'Manage your OpenClaw instances' },
  '/app/logs': { title: 'Live Logs', desc: 'Real-time log streaming' },
  '/app/activity': { title: 'Activity', desc: 'Recent actions and events' },
  '/app/settings': { title: 'Settings', desc: 'Account and preferences' },
}

export function Header() {
  const { pathname } = useLocation()
  const { user } = useAuthStore()
  const page = titles[pathname] ?? { title: 'Mission Control', desc: '' }

  return (
    <header className="h-12 flex items-center gap-4 px-5 border-b border-border-1 bg-surface-1 flex-shrink-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-white">{page.title}</h1>
          {page.desc && <span className="text-zinc-600 text-xs hidden sm:block">— {page.desc}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="xs" className="text-zinc-500">
          <Search size={13} /> <span className="hidden md:block text-2xs">Search</span>
          <kbd className="hidden md:block text-2xs bg-surface-3 border border-border-1 px-1 rounded ml-1">⌘K</kbd>
        </Button>
        <Button variant="ghost" size="xs"><Bell size={13} /></Button>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
          <span className="text-2xs font-bold text-white">{user?.name[0]?.toUpperCase()}</span>
        </div>
      </div>
    </header>
  )
}
