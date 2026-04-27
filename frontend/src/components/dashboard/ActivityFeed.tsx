import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { Activity, Bot, RefreshCw, Settings, Square, Play } from 'lucide-react'
import { api } from '../../lib/api'
import { Spinner } from '../ui/Spinner'

const actionConfig: Record<string, { label: string; icon: typeof Activity; color: string }> = {
  agent_created: { label: 'Agent linked', icon: Bot, color: 'text-rose-400' },
  restart: { label: 'Restarted', icon: RefreshCw, color: 'text-amber-400' },
  stop: { label: 'Stopped', icon: Square, color: 'text-red-400' },
  start: { label: 'Started', icon: Play, color: 'text-green-400' },
  config_updated: { label: 'Config updated', icon: Settings, color: 'text-blue-400' },
}

export function ActivityFeed() {
  const { data, isLoading } = useQuery({ queryKey: ['activity'], queryFn: api.activity.list, refetchInterval: 30000 })

  return (
    <div className="bg-surface-1 border border-border-1 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border-1 flex items-center gap-2">
        <Activity size={13} className="text-zinc-500" />
        <h3 className="text-xs font-semibold text-zinc-300">Activity</h3>
      </div>
      <div className="divide-y divide-border-1 max-h-80 overflow-y-auto">
        {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!isLoading && (!data || data.length === 0) && (
          <p className="text-xs text-zinc-600 text-center py-8">No activity yet</p>
        )}
        {data?.map((item) => {
          const cfg = actionConfig[item.action] ?? { label: item.action, icon: Activity, color: 'text-zinc-500' }
          const Icon = cfg.icon
          return (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-2 transition-colors">
              <div className={`flex-shrink-0 ${cfg.color}`}><Icon size={13} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-300">{cfg.label}{item.agent_name ? <span className="text-zinc-600"> · {item.agent_name}</span> : ''}</p>
                {item.detail && <p className="text-2xs text-zinc-700 truncate">{item.detail}</p>}
              </div>
              <span className="text-2xs text-zinc-700 flex-shrink-0">
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
