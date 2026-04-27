import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Bot, Search, Grid, List } from 'lucide-react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { AgentCard } from '../../components/agents/AgentCard'
import { AddAgentModal } from '../../components/agents/AddAgentModal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Spinner } from '../../components/ui/Spinner'
import { Badge } from '../../components/ui/Badge'
import { StatusDot } from '../../components/ui/StatusDot'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

export function Agents() {
  const [addOpen, setAddOpen] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: api.agents.list,
    refetchInterval: 15000,
  })

  const filtered = agents?.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.ip.includes(search) ||
    a.model.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-surface-1 border border-border-1 rounded-lg px-3 h-9">
          <Search size={13} className="text-zinc-600 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents by name, IP, or model..."
            className="bg-transparent flex-1 text-sm text-white placeholder-zinc-700 outline-none"
          />
        </div>
        <div className="flex items-center bg-surface-1 border border-border-1 rounded-lg p-0.5">
          <button onClick={() => setView('grid')} className={clsx('p-1.5 rounded transition-colors', view === 'grid' ? 'bg-surface-3 text-white' : 'text-zinc-600 hover:text-zinc-400')}>
            <Grid size={14} />
          </button>
          <button onClick={() => setView('list')} className={clsx('p-1.5 rounded transition-colors', view === 'list' ? 'bg-surface-3 text-white' : 'text-zinc-600 hover:text-zinc-400')}>
            <List size={14} />
          </button>
        </div>
        <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
          <Plus size={13} /> Link Agent
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : !filtered?.length ? (
        <EmptyState icon={<Bot size={24} />} title={search ? 'No agents match' : 'No agents linked'}
          description={search ? 'Try a different search term' : 'Link your first OpenClaw instance.'}
          action={!search ? <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}><Plus size={13} /> Link Agent</Button> : undefined}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a) => <AgentCard key={a.id} agent={a} />)}
        </div>
      ) : (
        <div className="bg-surface-1 border border-border-1 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 px-4 py-2 border-b border-border-1 text-2xs text-zinc-600 font-medium uppercase tracking-wider">
            <span>Name</span><span>Status</span><span>Model</span><span>IP</span><span></span>
          </div>
          {filtered.map((a) => (
            <div key={a.id} onClick={() => navigate(`/app/agents/${a.id}`)}
              className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-4 px-4 py-3 border-b border-border-1 last:border-0 hover:bg-surface-2 cursor-pointer items-center transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-violet-500/10 flex items-center justify-center text-violet-400 text-2xs font-bold">{a.name[0]}</div>
                <div>
                  <p className="text-xs font-medium text-white">{a.name}</p>
                  {a.description && <p className="text-2xs text-zinc-600 truncate max-w-48">{a.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <StatusDot active={a.active} />
                <Badge variant={a.active ? 'green' : 'gray'}>{a.active ? 'Online' : 'Offline'}</Badge>
              </div>
              <span className="text-2xs text-zinc-500 font-mono">{a.model}</span>
              <span className="text-2xs text-zinc-600 font-mono">{a.ip}</span>
              <Button variant="ghost" size="xs">View →</Button>
            </div>
          ))}
        </div>
      )}

      <AddAgentModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
