import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { Activity, Bot, RefreshCw, Settings, Square, Play } from 'lucide-react'
import { api } from '../../lib/api'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { Badge } from '../../components/ui/Badge'

const actionConfig: Record<string, { label: string; icon: typeof Activity; variant: 'rose' | 'green' | 'blue' | 'red' | 'amber' | 'gray' }> = {
  agent_created: { label: 'Agent Linked', icon: Bot, variant: 'rose' },
  restart: { label: 'Restarted', icon: RefreshCw, variant: 'amber' },
  stop: { label: 'Stopped', icon: Square, variant: 'red' },
  start: { label: 'Started', icon: Play, variant: 'green' },
  config_updated: { label: 'Config Updated', icon: Settings, variant: 'blue' },
}

export function ActivityPage() {
  const { data, isLoading } = useQuery({ queryKey: ['activity'], queryFn: api.activity.list, refetchInterval: 15000 })

  return (
    <div className="p-5 animate-fade-in">
      <div className="bg-surface-1 border border-border-1 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-1 flex items-center gap-2">
          <Activity size={14} className="text-zinc-500" />
          <h3 className="text-sm font-semibold text-white">Activity Log</h3>
          <span className="text-xs text-zinc-600 ml-auto">{data?.length ?? 0} events</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : !data?.length ? (
          <EmptyState icon={<Activity size={24} />} title="No activity yet" description="Actions like restarts and config changes will appear here." />
        ) : (
          <div className="divide-y divide-border-1">
            {data.map((item) => {
              const cfg = actionConfig[item.action] ?? { label: item.action, icon: Activity, variant: 'gray' as const }
              const Icon = cfg.icon
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border-1 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      {item.agent_name && <span className="text-xs text-zinc-500">{item.agent_name}</span>}
                    </div>
                    {item.detail && <p className="text-2xs text-zinc-700 mt-0.5 truncate">{item.detail}</p>}
                  </div>
                  <span className="text-2xs text-zinc-700 flex-shrink-0">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
