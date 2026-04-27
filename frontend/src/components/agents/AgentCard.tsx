import { useNavigate } from 'react-router-dom'
import { MoreHorizontal, RefreshCw, Square, Play, Cpu, ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import { AgentStatus } from '../../types'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { StatusDot } from '../ui/StatusDot'
import { Tooltip } from '../ui/Tooltip'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import toast from 'react-hot-toast'

interface Props { agent: AgentStatus }

const accentMap: Record<string, 'green' | 'blue' | 'violet' | 'amber'> = {
  green: 'green', blue: 'blue', violet: 'violet', amber: 'amber',
}

export function AgentCard({ agent }: Props) {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const accent = accentMap[agent.accent] ?? 'violet'

  const mutate = (fn: () => Promise<unknown>, msg: string) =>
    useMutation({
      mutationFn: fn,
      onSuccess: () => { toast.success(msg); qc.invalidateQueries({ queryKey: ['agents'] }) },
      onError: () => toast.error('Action failed'),
    })

  const restart = mutate(() => api.agents.restart(agent.id), 'Restarted')
  const stop = mutate(() => api.agents.stop(agent.id), 'Stopped')
  const start = mutate(() => api.agents.start(agent.id), 'Started')

  return (
    <Card accent={agent.accent} className="flex flex-col group hover:border-opacity-60 transition-all">
      {/* Header */}
      <div className="p-4 border-b border-border-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={clsx(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold',
              accent === 'green' ? 'bg-green-500/10 text-green-400' :
              accent === 'blue' ? 'bg-blue-500/10 text-blue-400' :
              accent === 'amber' ? 'bg-amber-500/10 text-amber-400' :
              'bg-violet-500/10 text-violet-400'
            )}>
              {agent.name[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white truncate">{agent.name}</p>
                <StatusDot active={agent.active} />
              </div>
              <p className="text-2xs text-zinc-600 font-mono truncate">{agent.ip}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Tooltip content="Open detail">
              <Button variant="ghost" size="xs" onClick={() => navigate(`/app/agents/${agent.id}`)}>
                <ExternalLink size={12} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3 border-b border-border-1">
        <div>
          <p className="text-2xs text-zinc-600 mb-0.5">Status</p>
          <Badge variant={agent.active ? 'green' : 'gray'} dot>{agent.active ? 'Online' : 'Offline'}</Badge>
        </div>
        <div>
          <p className="text-2xs text-zinc-600 mb-0.5">Model</p>
          <p className="text-2xs text-zinc-400 font-mono truncate">{agent.model}</p>
        </div>
        {agent.pid && (
          <div>
            <p className="text-2xs text-zinc-600 mb-0.5">PID</p>
            <p className="text-2xs text-zinc-400 font-mono">{agent.pid}</p>
          </div>
        )}
        {agent.description && (
          <div className="col-span-2">
            <p className="text-2xs text-zinc-600 truncate">{agent.description}</p>
          </div>
        )}
      </div>

      {/* Log preview */}
      {agent.last_log_lines.length > 0 && (
        <div className="px-4 py-3 border-b border-border-1">
          <p className="text-2xs text-zinc-600 mb-1.5 uppercase tracking-widest">Last activity</p>
          <div className="space-y-0.5">
            {agent.last_log_lines.slice(-3).map((line, i) => (
              <p key={i} className="text-2xs font-mono text-zinc-600 truncate leading-relaxed">{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex items-center gap-1.5">
        <Tooltip content="Restart">
          <Button variant="ghost" size="xs" onClick={() => restart.mutate()} loading={restart.isPending} disabled={!agent.active}>
            <RefreshCw size={12} />
          </Button>
        </Tooltip>
        <Tooltip content="Stop">
          <Button variant="danger" size="xs" onClick={() => stop.mutate()} loading={stop.isPending} disabled={!agent.active}>
            <Square size={12} />
          </Button>
        </Tooltip>
        <Tooltip content="Start">
          <Button variant="ghost" size="xs" onClick={() => start.mutate()} loading={start.isPending} disabled={agent.active}>
            <Play size={12} />
          </Button>
        </Tooltip>
        <div className="flex-1" />
        <Button variant="ghost" size="xs" onClick={() => navigate(`/app/agents/${agent.id}`)}>
          View <ExternalLink size={11} />
        </Button>
      </div>
    </Card>
  )
}
