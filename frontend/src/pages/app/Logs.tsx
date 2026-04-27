import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { LogViewer } from '../../components/logs/LogViewer'
import { Spinner } from '../../components/ui/Spinner'
import { EmptyState } from '../../components/ui/EmptyState'
import { ScrollText } from 'lucide-react'

export function Logs() {
  const { data: agents, isLoading } = useQuery({ queryKey: ['agents'], queryFn: api.agents.list })

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>
  if (!agents?.length) return (
    <div className="p-5">
      <EmptyState icon={<ScrollText size={24} />} title="No agents" description="Link an agent first to view logs." />
    </div>
  )

  return (
    <div className={`h-full p-4 grid gap-4`}
      style={{ gridTemplateColumns: `repeat(${Math.min(agents.length, 2)}, 1fr)` }}>
      {agents.map((a) => (
        <LogViewer key={a.id} agentId={a.id} agentName={a.name} accent={a.accent} />
      ))}
    </div>
  )
}
