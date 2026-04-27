import { NavLink, useNavigate } from 'react-router-dom'
import { Activity, BarChart2, Bell, Bot, CheckSquare, Columns3, Globe, LayoutDashboard, LogOut, Plug, ScrollText, Settings, Shield, Users, Webhook, Zap } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '../../store/auth'
import { Tooltip } from '../ui/Tooltip'

const groups = [
  {
    label: 'Overview',
    items: [
      { to: '/app', icon: LayoutDashboard, label: 'Fleet Overview', end: true },
      { to: '/app/agents', icon: Bot, label: 'Agents' },
      { to: '/app/logs', icon: ScrollText, label: 'Live Logs' },
      { to: '/app/activity', icon: Activity, label: 'Activity' },
      { to: '/app/analytics', icon: BarChart2, label: 'Analytics' },
      { to: '/app/status', icon: Globe, label: 'Status Page' },
    ],
  },
  {
    label: 'Boards',
    items: [
      { to: '/app/boards', icon: Columns3, label: 'Boards' },
      { to: '/app/approvals', icon: CheckSquare, label: 'Approvals' },
    ],
  },
  {
    label: 'Skills',
    items: [
      { to: '/app/skills', icon: Plug, label: 'Skills Marketplace' },
      { to: '/app/skills/installed', icon: Zap, label: 'Installed Skills' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/app/team', icon: Users, label: 'Team' },
      { to: '/app/channels', icon: Zap, label: 'Channels' },
      { to: '/app/sessions', icon: Activity, label: 'Sessions' },
      { to: '/app/notifications', icon: Bell, label: 'Notifications' },
      { to: '/app/webhooks', icon: Webhook, label: 'Webhooks' },
      { to: '/app/organization', icon: Shield, label: 'Organization' },
      { to: '/app/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <aside className="w-14 flex flex-col items-center py-3 bg-surface-1 border-r border-border-1 flex-shrink-0">
      <div className="mb-4 mt-1">
        <img src="/logo.png" alt="ClawDesk" className="h-8 w-8 rounded-lg object-contain shadow-lg" />
      </div>

      <nav className="flex flex-col items-center gap-2 flex-1 overflow-y-auto px-1">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col items-center gap-0.5">
            <div className="w-7 border-t border-border-1 my-0.5" />
            {group.items.map(({ to, icon: Icon, label, end }) => (
              <Tooltip key={to} content={`${group.label} / ${label}`}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => clsx(
                    'w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150',
                    isActive
                      ? 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/20'
                      : 'text-zinc-600 hover:text-zinc-400 hover:bg-surface-2'
                  )}
                >
                  <Icon size={16} />
                </NavLink>
              </Tooltip>
            ))}
          </div>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-2 mt-2">
        <Tooltip content="System online">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-500/10 text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.7)]" />
          </div>
        </Tooltip>
        <Tooltip content="Logout">
          <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={15} />
          </button>
        </Tooltip>
        {user && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)' }}>
            <span className="text-2xs font-bold text-white">{user.name[0]?.toUpperCase()}</span>
          </div>
        )}
      </div>
    </aside>
  )
}
