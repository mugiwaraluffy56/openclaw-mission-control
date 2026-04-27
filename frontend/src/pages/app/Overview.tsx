import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Bot, RefreshCw } from 'lucide-react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { AgentCard } from '../../components/agents/AgentCard'
import { StatsRow } from '../../components/dashboard/StatsRow'
import { ActivityFeed } from '../../components/dashboard/ActivityFeed'
import { AddAgentModal } from '../../components/agents/AddAgentModal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Spinner } from '../../components/ui/Spinner'
import { useAuthStore } from '../../store/auth'

export function Overview() {
  const [addOpen, setAddOpen] = useState(false)
  const { user } = useAuthStore()
  const { data: agents, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['agents'],
    queryFn: api.agents.list,
    refetchInterval: 15000,
  })

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Good to see you, {user?.name.split(' ')[0]} 👋</h2>
          <p className="text-xs text-zinc-600 mt-0.5">Here's what's running across your fleet.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => refetch()} loading={isFetching}>
            <RefreshCw size={13} />
          </Button>
          <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
            <Plus size={13} /> Link Agent
          </Button>
        </div>
      </div>

      {/* Stats */}
      {agents && <StatsRow agents={agents} />}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Agents grid */}
        <div className="xl:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : !agents?.length ? (
            <EmptyState
              icon={<Bot size={24} />}
              title="No agents linked"
              description="Link your first OpenClaw instance to start monitoring."
              action={<Button variant="primary" size="sm" onClick={() => setAddOpen(true)}><Plus size={13} /> Link Agent</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {agents.map((a) => <AgentCard key={a.id} agent={a} />)}
            </div>
          )}
        </div>

        {/* Activity sidebar */}
        <div><ActivityFeed /></div>
      </div>

      <AddAgentModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
