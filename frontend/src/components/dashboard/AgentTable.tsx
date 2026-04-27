import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RefreshCw, Square, Play, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { AgentStatus } from '../../types'
import { api } from '../../lib/api'
import { Badge } from '../ui/Badge'
import { StatusDot } from '../ui/StatusDot'
import { Button } from '../ui/Button'

interface Props {
  agents: AgentStatus[]
}

export function AgentTable({ agents }: Props) {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const invalidate = () => { qc.invalidateQueries({ queryKey: ['agents'] }) }

  const restart = useMutation({ mutationFn: (id: string) => api.agents.restart(id), onSuccess: () => { toast.success('Restarted'); invalidate() } })
  const stop = useMutation({ mutationFn: (id: string) => api.agents.stop(id), onSuccess: () => { toast.success('Stopped'); invalidate() } })
  const start = useMutation({ mutationFn: (id: string) => api.agents.start(id), onSuccess: () => { toast.success('Started'); invalidate() } })

  return (
    <div className="bg-surface-1 border border-border-1 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-1">
              {['Name', 'Status', 'Model', 'IP Address', 'PID', 'Uptime', 'Last Seen', ''].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-2xs font-semibold uppercase tracking-wider text-zinc-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr
                key={a.id}
                className="border-b border-border-1 last:border-0 hover:bg-surface-2 transition-colors cursor-pointer"
                onClick={() => navigate(`/app/agents/${a.id}`)}
              >
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-2xs font-bold flex-shrink-0">
                      {a.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">{a.name}</p>
                      {a.description && <p className="text-2xs text-zinc-600 truncate max-w-[180px]">{a.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <StatusDot active={a.active} />
                    <Badge variant={a.active ? 'green' : 'red'}>{a.active ? 'Online' : 'Offline'}</Badge>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-2xs font-mono text-zinc-500">{a.model}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-2xs font-mono text-zinc-500">{a.ip}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-2xs font-mono text-zinc-600">{a.pid ?? 'N/A'}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-2xs font-mono text-zinc-500">{a.uptime ?? 'N/A'}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-2xs text-zinc-600 whitespace-nowrap">
                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                  </span>
                </td>
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="xs" onClick={() => restart.mutate(a.id)} disabled={!a.active} title="Restart">
                      <RefreshCw size={11} />
                    </Button>
                    {a.active
                      ? <Button variant="ghost" size="xs" onClick={() => stop.mutate(a.id)} title="Stop"><Square size={11} /></Button>
                      : <Button variant="ghost" size="xs" onClick={() => start.mutate(a.id)} title="Start"><Play size={11} /></Button>
                    }
                    <Button variant="ghost" size="xs" onClick={() => navigate(`/app/agents/${a.id}`)} title="View">
                      <ExternalLink size={11} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
