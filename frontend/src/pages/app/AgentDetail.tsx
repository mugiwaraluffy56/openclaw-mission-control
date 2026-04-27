import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, RefreshCw, Square, Play, Trash2, Bot, Settings, ScrollText, Users, BarChart2, Save, Terminal, Radio } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../../lib/api'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { StatusDot } from '../../components/ui/StatusDot'
import { Tabs } from '../../components/ui/Tabs'
import { Card } from '../../components/ui/Card'
import { LogViewer } from '../../components/logs/LogViewer'
import { Spinner } from '../../components/ui/Spinner'

const TABS = [
  { id: 'overview', label: 'Overview', icon: <BarChart2 size={12} /> },
  { id: 'logs', label: 'Live Logs', icon: <ScrollText size={12} /> },
  { id: 'config', label: 'Config', icon: <Settings size={12} /> },
  { id: 'sessions', label: 'Sessions', icon: <Users size={12} /> },
  { id: 'commands', label: 'Commands', icon: <Terminal size={12} /> },
  { id: 'channels', label: 'Channels', icon: <Radio size={12} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={12} /> },
]

export function AgentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [tab, setTab] = useState('overview')
  const [configText, setConfigText] = useState('')
  const [configDirty, setConfigDirty] = useState(false)
  const [command, setCommand] = useState('systemctl --user status openclaw-gateway.service --no-pager')

  const { data: agent, isLoading } = useQuery({
    queryKey: ['agent', id],
    queryFn: () => api.agents.get(id!),
    refetchInterval: 10000,
    enabled: !!id,
  })

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ['config', id],
    queryFn: () => api.agents.getConfig(id!),
    enabled: tab === 'config' && !!id,
  })

  useEffect(() => {
    if (config && !configDirty) setConfigText(JSON.stringify(config, null, 2))
  }, [config, configDirty])

  const { data: sessions } = useQuery({
    queryKey: ['sessions', id],
    queryFn: () => api.agents.getSessions(id!),
    enabled: tab === 'sessions' && !!id,
    refetchInterval: 10000,
  })

  const { data: stats } = useQuery({
    queryKey: ['stats', id],
    queryFn: () => api.agents.getStats(id!),
    enabled: tab === 'overview' && !!id,
    refetchInterval: 30000,
  })

  const { data: channels } = useQuery({
    queryKey: ['channels', id],
    queryFn: () => api.agents.getChannels(id!),
    enabled: tab === 'channels' && !!id,
  })

  const invalidate = () => { qc.invalidateQueries({ queryKey: ['agent', id] }); qc.invalidateQueries({ queryKey: ['agents'] }) }
  const restart = useMutation({ mutationFn: () => api.agents.restart(id!), onSuccess: () => { toast.success('Restarted'); invalidate() } })
  const stop = useMutation({ mutationFn: () => api.agents.stop(id!), onSuccess: () => { toast.success('Stopped'); invalidate() } })
  const start = useMutation({ mutationFn: () => api.agents.start(id!), onSuccess: () => { toast.success('Started'); invalidate() } })
  const del = useMutation({ mutationFn: () => api.agents.delete(id!), onSuccess: () => { toast.success('Agent removed'); navigate('/app/agents') } })
  const saveConfig = useMutation({
    mutationFn: () => api.agents.updateConfig(id!, JSON.parse(configText)),
    onSuccess: () => { toast.success('Config saved & gateway restarted'); setConfigDirty(false) },
    onError: () => toast.error('Invalid JSON or save failed'),
  })
  const runCommand = useMutation({
    mutationFn: () => api.agents.runCommand(id!, command),
    onError: () => toast.error('Command failed to run'),
  })

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>
  if (!agent) return <div className="p-5 text-zinc-600">Agent not found</div>

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-1 bg-surface-1">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="xs" onClick={() => navigate(-1)}><ArrowLeft size={13} /> Back</Button>
          <span className="text-zinc-700">/</span>
          <span className="text-xs text-zinc-500">{agent.name}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Bot size={18} className="text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">{agent.name}</h1>
                <StatusDot active={agent.active} size="md" />
                <Badge variant={agent.active ? 'green' : 'red'} dot>{agent.active ? 'Online' : 'Offline'}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-2xs text-zinc-600 font-mono">{agent.ip}</span>
                <span className="text-zinc-700">·</span>
                <span className="text-2xs text-zinc-600 font-mono">{agent.model}</span>
                {agent.pid && <><span className="text-zinc-700">·</span><span className="text-2xs text-zinc-600">PID {agent.pid}</span></>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="secondary" size="sm" onClick={() => restart.mutate()} loading={restart.isPending} disabled={!agent.active}>
              <RefreshCw size={12} /> Restart
            </Button>
            {agent.active
              ? <Button variant="danger" size="sm" onClick={() => stop.mutate()} loading={stop.isPending}><Square size={12} /> Stop</Button>
              : <Button variant="secondary" size="sm" onClick={() => start.mutate()} loading={start.isPending}><Play size={12} /> Start</Button>
            }
            <Button variant="danger" size="sm" onClick={() => { if (confirm('Remove this agent?')) del.mutate() }} loading={del.isPending}>
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 bg-surface-1 border-b border-border-1">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5">
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">System</h3>
              {stats ? (
                <div className="space-y-3">
                  {[
                    { label: 'CPU Usage', value: stats.cpu ? `${stats.cpu}%` : 'N/A' },
                    { label: 'Memory', value: stats.memory ? `${stats.memory}%` : 'N/A' },
                    { label: 'Uptime', value: stats.uptime || 'N/A' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-xs text-zinc-600">{label}</span>
                      <span className="text-xs font-mono text-zinc-300">{value}</span>
                    </div>
                  ))}
                </div>
              ) : <Spinner className="w-4 h-4" />}
            </Card>

            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Agent Info</h3>
              <div className="space-y-3">
                {[
                  { label: 'Name', value: agent.name },
                  { label: 'IP', value: agent.ip },
                  { label: 'Model', value: agent.model },
                  { label: 'Added', value: new Date(agent.created_at).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-zinc-600">{label}</span>
                    <span className="text-xs font-mono text-zinc-300 truncate max-w-32">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Recent Logs</h3>
              <div className="space-y-0.5">
                {agent.last_log_lines.length > 0
                  ? agent.last_log_lines.map((l, i) => <p key={i} className="text-2xs font-mono text-zinc-600 truncate leading-relaxed">{l}</p>)
                  : <p className="text-2xs text-zinc-700">No recent logs</p>}
              </div>
            </Card>
          </div>
        )}

        {tab === 'logs' && (
          <div className="h-[calc(100vh-260px)]">
            <LogViewer agentId={agent.id} agentName={agent.name} accent={agent.accent} />
          </div>
        )}

        {tab === 'config' && (
          <div className="flex flex-col gap-3">
            {configLoading ? <Spinner /> : (
              <>
                {configDirty && (
                  <div className="flex items-center justify-between px-4 py-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <p className="text-xs text-amber-400">Unsaved changes. Saving will restart gateway.</p>
                    <Button variant="primary" size="sm" onClick={() => saveConfig.mutate()} loading={saveConfig.isPending}>
                      <Save size={12} /> Save & Restart
                    </Button>
                  </div>
                )}
                <textarea
                  value={configText}
                  onChange={(e) => { setConfigText(e.target.value); setConfigDirty(true) }}
                  className="w-full h-[calc(100vh-320px)] bg-surface-1 border border-border-1 rounded-xl p-4 font-mono text-xs text-zinc-300 outline-none focus:border-rose-500/40 resize-none leading-relaxed"
                  spellCheck={false}
                />
              </>
            )}
          </div>
        )}

        {tab === 'sessions' && (
          <div className="space-y-2">
            {!sessions || Object.keys(sessions).length === 0 ? (
              <p className="text-sm text-zinc-600 text-center py-8">No active sessions</p>
            ) : Object.entries(sessions).map(([key]) => (
              <div key={key} className="flex items-center gap-3 px-4 py-3 bg-surface-1 border border-border-1 rounded-lg">
                <Users size={13} className="text-zinc-600" />
                <p className="text-xs font-mono text-zinc-400">{key}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'commands' && (
          <div className="grid grid-cols-1 xl:grid-cols-[420px,1fr] gap-4">
            <Card className="p-4 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Run command</h3>
              <textarea value={command} onChange={(e) => setCommand(e.target.value)} className="w-full h-32 bg-surface-2 border border-border-1 rounded-lg p-3 text-xs font-mono text-white outline-none" />
              <Button variant="primary" size="sm" onClick={() => runCommand.mutate()} loading={runCommand.isPending}><Terminal size={12} /> Execute</Button>
            </Card>
            <pre className="bg-surface-1 border border-border-1 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-auto min-h-[320px] whitespace-pre-wrap">{runCommand.data ? `$ ${command}\n\n${runCommand.data.stdout}${runCommand.data.stderr ? `\nERR:\n${runCommand.data.stderr}` : ''}` : 'Command output will appear here.'}</pre>
          </div>
        )}

        {tab === 'channels' && (
          <pre className="bg-surface-1 border border-border-1 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-auto min-h-[420px]">{JSON.stringify(channels?.channels ?? [], null, 2)}</pre>
        )}

        {tab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 space-y-3"><h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Identity</h3><p className="text-xs text-zinc-500">Agent metadata is edited from the Agents table. SSH credentials and gateway tokens are never returned to the browser.</p></Card>
            <Card className="p-4 space-y-3"><h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider">Danger</h3><Button variant="danger" size="sm" onClick={() => { if (confirm('Remove this agent?')) del.mutate() }}><Trash2 size={12} /> Remove agent</Button></Card>
          </div>
        )}
      </div>
    </div>
  )
}
