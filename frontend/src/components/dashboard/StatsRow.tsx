import { Bot, CheckCircle, XCircle, Activity } from 'lucide-react'
import { AgentStatus } from '../../types'

interface Props { agents: AgentStatus[] }

export function StatsRow({ agents }: Props) {
  const online = agents.filter((a) => a.active).length
  const offline = agents.length - online

  const stats = [
    { label: 'Total Agents', value: agents.length, icon: Bot, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Online', value: online, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Offline', value: offline, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Uptime', value: online > 0 ? `${Math.round((online / agents.length) * 100)}%` : 'N/A', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-surface-1 border border-border-1 rounded-xl p-4 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bg}`}>
            <Icon size={16} className={color} />
          </div>
          <div>
            <p className="text-2xs text-zinc-600 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
