import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { ArrowDown, Search, Trash2, Wifi, WifiOff } from 'lucide-react'
import { Button } from '../ui/Button'
import { wsLogsUrl } from '../../lib/api'

interface Props { agentId: string; agentName: string; accent?: string }

function getLineClass(line: string) {
  const l = line.toLowerCase()
  if (l.includes('error') || l.includes('err ') || l.includes('failed') || l.includes('fatal')) return 'text-red-400'
  if (l.includes('warn')) return 'text-amber-400'
  if (l.includes('ready') || l.includes(' ok ') || l.includes('started')) return 'text-emerald-400'
  if (l.includes('info')) return 'text-zinc-400'
  return 'text-zinc-600'
}

export function LogViewer({ agentId, agentName, accent = 'violet' }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const [filter, setFilter] = useState('')
  const [autoScroll, setAutoScroll] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const accentColor = accent === 'green' ? 'text-green-400 border-green-500/20' : accent === 'blue' ? 'text-blue-400 border-blue-500/20' : 'text-violet-400 border-violet-500/20'

  useEffect(() => {
    const url = wsLogsUrl(agentId)
    const ws = new WebSocket(url)
    wsRef.current = ws
    ws.onopen = () => setConnected(true)
    ws.onmessage = (e) => setLines((p) => [...p.slice(-999), e.data as string])
    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)
    return () => ws.close()
  }, [agentId])

  useEffect(() => {
    if (autoScroll) bottomRef.current?.scrollIntoView()
  }, [lines, autoScroll])

  const filtered = filter ? lines.filter((l) => l.toLowerCase().includes(filter.toLowerCase())) : lines

  return (
    <div className={`flex flex-col h-full rounded-xl border overflow-hidden ${accentColor.split(' ')[1]}`} style={{ background: '#070708' }}>
      {/* Header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${accentColor.split(' ')[1]} bg-surface-1`}>
        <div className="flex items-center gap-2">
          {connected ? <Wifi size={12} className="text-green-400" /> : <WifiOff size={12} className="text-red-400" />}
          <span className={`text-xs font-semibold ${accentColor.split(' ')[0]}`}>{agentName}</span>
          <span className="text-2xs text-zinc-700">{filtered.length} lines</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 bg-surface-2 border border-border-1 rounded px-2 h-6">
            <Search size={10} className="text-zinc-600" />
            <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="filter..." className="bg-transparent text-2xs text-zinc-400 placeholder-zinc-700 outline-none w-20" />
          </div>
          <Button variant="ghost" size="xs" onClick={() => setAutoScroll((p) => !p)}>
            <ArrowDown size={11} className={autoScroll ? 'text-green-400' : 'text-zinc-600'} />
          </Button>
          <Button variant="ghost" size="xs" onClick={() => setLines([])}><Trash2 size={11} /></Button>
        </div>
      </div>

      {/* Log lines */}
      <div className="flex-1 overflow-y-auto font-mono">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-2xs text-zinc-700">
            {connected ? 'Waiting for logs...' : 'Connecting...'}
          </div>
        ) : (
          filtered.map((line, i) => (
            <div key={i} className={clsx('text-2xs px-3 py-px leading-5 hover:bg-white/[0.02]', getLineClass(line))}>
              {line}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
