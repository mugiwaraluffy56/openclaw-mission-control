import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { AgentStatus } from '../../types'
import { Link } from 'react-router-dom'

interface Props {
  agents: AgentStatus[]
}

export function AlertBanner({ agents }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const offline = agents.filter((a) => !a.active)

  if (dismissed || offline.length === 0) return null

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg">
      <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-xs text-amber-300 font-medium">
          {offline.length} agent{offline.length > 1 ? 's' : ''} offline:&nbsp;
        </span>
        <span className="text-xs text-amber-400">
          {offline.map((a, i) => (
            <span key={a.id}>
              <Link to={`/app/agents/${a.id}`} className="underline underline-offset-2 hover:text-amber-300">{a.name}</Link>
              {i < offline.length - 1 && ', '}
            </span>
          ))}
        </span>
      </div>
      <button onClick={() => setDismissed(true)} className="text-amber-600 hover:text-amber-400 transition-colors flex-shrink-0">
        <X size={13} />
      </button>
    </div>
  )
}
