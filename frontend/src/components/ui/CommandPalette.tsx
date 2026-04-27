import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Bot, LayoutDashboard, ScrollText, Activity, Settings, Users, RefreshCw, Square, Play, Zap, ArrowRight, Key, CreditCard, Bell, Globe, BarChart2 } from 'lucide-react'
import { api } from '../../lib/api'
import clsx from 'clsx'

interface CommandItem {
  id: string
  label: string
  sub?: string
  icon: React.ReactNode
  action: () => void
  group: string
  keywords?: string[]
}

interface Props {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('mc_recent_commands') ?? '[]') } catch { return [] }
  })
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const { data: agents } = useQuery({ queryKey: ['agents'], queryFn: api.agents.list, enabled: open })

  const nav = useCallback((to: string) => { navigate(to); onClose() }, [navigate, onClose])

  const staticCommands: CommandItem[] = [
    { id: 'overview', label: 'Go to Overview', icon: <LayoutDashboard size={14} />, action: () => nav('/app'), group: 'Navigate', keywords: ['dashboard', 'home'] },
    { id: 'agents', label: 'Go to Agents', icon: <Bot size={14} />, action: () => nav('/app/agents'), group: 'Navigate', keywords: ['instances'] },
    { id: 'logs', label: 'Go to Live Logs', icon: <ScrollText size={14} />, action: () => nav('/app/logs'), group: 'Navigate', keywords: ['streaming'] },
    { id: 'activity', label: 'Go to Activity', icon: <Activity size={14} />, action: () => nav('/app/activity'), group: 'Navigate', keywords: ['audit', 'events'] },
    { id: 'team', label: 'Go to Team', icon: <Users size={14} />, action: () => nav('/app/team'), group: 'Navigate' },
    { id: 'analytics', label: 'Go to Analytics', icon: <BarChart2 size={14} />, action: () => nav('/app/analytics'), group: 'Navigate' },
    { id: 'channels', label: 'Go to Channels', icon: <Zap size={14} />, action: () => nav('/app/channels'), group: 'Navigate' },
    { id: 'sessions', label: 'Go to Sessions', icon: <Users size={14} />, action: () => nav('/app/sessions'), group: 'Navigate' },
    { id: 'status', label: 'Go to Status Page', icon: <Globe size={14} />, action: () => nav('/app/status'), group: 'Navigate' },
    { id: 'settings-profile', label: 'Settings: Profile', icon: <Settings size={14} />, action: () => nav('/app/settings/profile'), group: 'Settings' },
    { id: 'settings-security', label: 'Settings: Security', icon: <Settings size={14} />, action: () => nav('/app/settings/security'), group: 'Settings' },
    { id: 'settings-api-keys', label: 'Settings: API Keys', icon: <Key size={14} />, action: () => nav('/app/settings/api-keys'), group: 'Settings' },
    { id: 'settings-billing', label: 'Settings: Billing', icon: <CreditCard size={14} />, action: () => nav('/app/settings/billing'), group: 'Settings' },
    { id: 'settings-notifications', label: 'Settings: Notifications', icon: <Bell size={14} />, action: () => nav('/app/settings/notifications'), group: 'Settings' },
  ]

  const agentCommands: CommandItem[] = (agents ?? []).flatMap((a) => [
    { id: `agent-view-${a.id}`, label: `View ${a.name}`, sub: a.ip, icon: <Bot size={14} />, action: () => nav(`/app/agents/${a.id}`), group: 'Agents', keywords: [a.ip, a.model] },
    { id: `agent-logs-${a.id}`, label: `Logs: ${a.name}`, sub: 'Open log stream', icon: <ScrollText size={14} />, action: () => nav('/app/logs'), group: 'Agent Actions', keywords: [a.ip] },
    { id: `agent-restart-${a.id}`, label: `Restart ${a.name}`, sub: a.ip, icon: <RefreshCw size={14} />, action: () => { api.agents.restart(a.id); onClose() }, group: 'Agent Actions', keywords: [a.ip] },
    { id: `agent-stop-${a.id}`, label: `Stop ${a.name}`, sub: a.ip, icon: <Square size={14} />, action: () => { api.agents.stop(a.id); onClose() }, group: 'Agent Actions', keywords: [a.ip] },
    { id: `agent-start-${a.id}`, label: `Start ${a.name}`, sub: a.ip, icon: <Play size={14} />, action: () => { api.agents.start(a.id); onClose() }, group: 'Agent Actions', keywords: [a.ip] },
  ])

  const allCommands = [...staticCommands, ...agentCommands]

  const filtered = query.trim()
    ? allCommands.filter((c) => {
        const q = query.toLowerCase()
        return (
          c.label.toLowerCase().includes(q) ||
          c.sub?.toLowerCase().includes(q) ||
          c.keywords?.some((k) => k.toLowerCase().includes(q))
        )
      })
    : allCommands

  const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    acc[cmd.group] = [...(acc[cmd.group] ?? []), cmd]
    return acc
  }, {})

  const flat = Object.values(groups).flat()

  const runCommand = (cmd: CommandItem) => {
    const next = [cmd.id, ...recentIds.filter((id) => id !== cmd.id)].slice(0, 8)
    setRecentIds(next)
    localStorage.setItem('mc_recent_commands', JSON.stringify(next))
    cmd.action()
  }

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => { setCursor(0) }, [query])

  useEffect(() => {
    const el = listRef.current?.children[cursor] as HTMLElement
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, flat.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); if (flat[cursor]) runCommand(flat[cursor]) }
    if (e.key === 'Escape') onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[580px] mx-4 bg-surface-1 border border-border-2 rounded-xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-1">
          <Search size={15} className="text-zinc-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search pages, agents, actions..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
          />
          <kbd className="hidden sm:block text-2xs bg-surface-3 border border-border-2 px-1.5 py-0.5 rounded text-zinc-500 font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-1" ref={listRef}>
          {flat.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-600">No results for "{query}"</div>
          ) : (
            <>
            {!query && recentIds.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-2xs font-semibold text-zinc-600 uppercase tracking-wider">Recent</div>
                {recentIds.map((id) => allCommands.find((c) => c.id === id)).filter(Boolean).map((cmd) => (
                  <button key={`recent-${cmd!.id}`} onClick={() => runCommand(cmd!)} className="w-full flex items-center gap-3 px-3 py-2 text-left text-zinc-400 hover:bg-surface-2 hover:text-white transition-colors">
                    <span className="text-zinc-600">{cmd!.icon}</span>
                    <span className="text-xs font-medium">{cmd!.label}</span>
                  </button>
                ))}
              </div>
            )}
            {Object.entries(groups).map(([group, items]) => (
              <div key={group}>
                <div className="px-3 py-1.5 text-2xs font-semibold text-zinc-600 uppercase tracking-wider">{group}</div>
                {items.map((cmd) => {
                  const idx = flat.indexOf(cmd)
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => runCommand(cmd)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                        cursor === idx ? 'bg-violet-500/10 text-white' : 'text-zinc-400 hover:bg-surface-2 hover:text-white'
                      )}
                    >
                      <span className={clsx('flex-shrink-0', cursor === idx ? 'text-violet-400' : 'text-zinc-600')}>
                        {cmd.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium">{cmd.label}</span>
                        {cmd.sub && <span className="ml-2 text-2xs text-zinc-600 font-mono">{cmd.sub}</span>}
                      </div>
                      {cursor === idx && <ArrowRight size={12} className="text-violet-400 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-1 px-4 py-2 flex items-center gap-3 text-2xs text-zinc-600">
          <span><kbd className="bg-surface-3 border border-border-2 px-1 rounded font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="bg-surface-3 border border-border-2 px-1 rounded font-mono">↵</kbd> select</span>
          <span><kbd className="bg-surface-3 border border-border-2 px-1 rounded font-mono">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
