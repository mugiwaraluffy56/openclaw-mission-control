import { NavLink, useNavigate } from 'react-router-dom'
import { Activity, Bot, LayoutDashboard, LogOut, ScrollText, Settings, Zap } from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '../../store/auth'
import { Tooltip } from '../ui/Tooltip'

const nav = [
  { to: '/app', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/app/agents', icon: Bot, label: 'Agents' },
  { to: '/app/logs', icon: ScrollText, label: 'Logs' },
  { to: '/app/activity', icon: Activity, label: 'Activity' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <aside className="w-14 flex flex-col items-center py-3 bg-surface-1 border-r border-border-1 flex-shrink-0">
      <div className="mb-4 mt-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg">
          <Zap size={14} className="text-white" />
        </div>
      </div>

      <nav className="flex flex-col items-center gap-0.5 flex-1">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <Tooltip key={to} content={label}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => clsx(
                'w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150',
                isActive
                  ? 'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/20'
                  : 'text-zinc-600 hover:text-zinc-400 hover:bg-surface-2'
              )}
            >
              <Icon size={16} />
            </NavLink>
          </Tooltip>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-2 mt-2">
        <Tooltip content="Logout">
          <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={15} />
          </button>
        </Tooltip>
        {user && (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <span className="text-2xs font-bold text-white">{user.name[0]?.toUpperCase()}</span>
          </div>
        )}
      </div>
    </aside>
  )
}
