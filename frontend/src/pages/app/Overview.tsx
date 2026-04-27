import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Bot, RefreshCw } from 'lucide-react'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { StatsRow } from '../../components/dashboard/StatsRow'
import { ActivityFeed } from '../../components/dashboard/ActivityFeed'
import { AddAgentModal } from '../../components/agents/AddAgentModal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Spinner } from '../../components/ui/Spinner'
import { useAuthStore } from '../../store/auth'
import { FleetChart } from '../../components/dashboard/FleetChart'
import { AgentTable } from '../../components/dashboard/AgentTable'
import { AlertBanner } from '../../components/dashboard/AlertBanner'

export function Overview() {
  const [addOpen, setAddOpen] = useState(false)
  const { user } = useAuthStore()
  const { data: agents, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['agents'],
    queryFn: api.agents.list,
    refetchInterval: 15000,
  })

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xs uppercase tracking-wider text-zinc-600">Fleet Overview</div>
          <h2 className="text-lg font-semibold text-white">Command Surface</h2>
          <p className="text-xs text-zinc-600 mt-0.5">Live operating view for {user?.name.split(' ')[0] ?? 'your'} OpenClaw fleet.</p>
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

      {agents && <AlertBanner agents={agents} />}
      {agents && <StatsRow agents={agents} />}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FleetChart title="Agent status" sub="Online and offline fleet count" dataKey={['online', 'offline']} />
            <FleetChart title="Activity volume" sub="Gateway log and action throughput" type="bar" dataKey="logs" />
          </div>
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
            <AgentTable agents={agents} />
          )}
        </div>

        <div><ActivityFeed /></div>
      </div>

      <AddAgentModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
