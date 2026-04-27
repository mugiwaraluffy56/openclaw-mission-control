import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, ArrowRight, Play } from 'lucide-react'

const LOG_LINES = [
  '[32m[INFO][0m  gateway started on port 3284',
  '[34m[MSG][0m   @alice: can you summarize this doc?',
  '[32m[INFO][0m  tool: read_file → /docs/q3-report.pdf',
  '[33m[TOOL][0m  reading 42 pages...',
  '[32m[INFO][0m  summarized in 1.2s, 847 tokens',
  '[34m[MSG][0m   @bob: restart the indexer',
  '[32m[INFO][0m  tool: bash → systemctl restart indexer',
  '[32m[OK][0m    indexer restarted (pid 4821)',
  '[34m[MSG][0m   @carol: what\'s the CPU usage?',
  '[32m[INFO][0m  tool: system_stats → cpu: 23%, mem: 41%',
  '[33m[WARN][0m  rate limit: 85% of hourly quota used',
  '[32m[INFO][0m  session #1041 connected (discord)',
  '[34m[MSG][0m   @dave: deploy staging branch',
  '[32m[INFO][0m  tool: bash → ./deploy.sh staging',
  '[32m[OK][0m    deployed in 8.3s, 3 services updated',
]

function renderLine(line: string) {
  return line
    .replace(/\[32m/g, '<span class="text-emerald-400">')
    .replace(/\[33m/g, '<span class="text-amber-400">')
    .replace(/\[34m/g, '<span class="text-blue-400">')
    .replace(/\[31m/g, '<span class="text-red-400">')
    .replace(/\[0m/g, '</span>')
}

export function Hero() {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % LOG_LINES.length
        setVisibleLines((v) => [...v.slice(-12), LOG_LINES[next]])
        return next
      })
    }, 900)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e2210_1px,transparent_1px),linear-gradient(to_bottom,#1e1e2210_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080809]" />
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Now in public beta. Free to start.
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
              <span className="text-white">Control your</span>
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)' }}>
                AI fleet.
              </span>
            </h1>
            <p className="text-base text-zinc-400 leading-relaxed max-w-md">
              One dashboard to monitor, manage, and control every OpenClaw instance running on any server. Real-time logs, SSH control, config editor, and team access in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/auth/signup"
              className="inline-flex items-center gap-2 h-10 px-5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Get started free <ArrowRight size={14} />
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 h-10 px-5 bg-surface-2 hover:bg-surface-3 text-zinc-300 text-sm font-medium rounded-lg border border-border-2 transition-colors"
            >
              <Play size={13} /> Sign in
            </Link>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Deploy in 60s</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Self-host friendly</span>
          </div>
        </div>

        {/* Right: Terminal */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl opacity-30 blur-xl" style={{ backgroundImage: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)' }} />
          <div className="relative bg-surface-1 border border-border-2 rounded-xl overflow-hidden shadow-2xl">
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border-1 bg-surface-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 flex items-center justify-center gap-2">
                <Zap size={11} className="text-violet-400" />
                <span className="text-2xs text-zinc-500 font-mono">openclaw · prod-agent-01 · live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>
            {/* Log output */}
            <div className="px-4 py-3 h-[320px] font-mono text-2xs overflow-hidden space-y-0.5" style={{ background: '#050506' }}>
              {visibleLines.map((line, i) => (
                <div
                  key={i}
                  className="leading-5 text-zinc-500 animate-fade-in"
                  dangerouslySetInnerHTML={{ __html: renderLine(line) }}
                />
              ))}
              <div className="flex items-center gap-1 text-zinc-600 mt-1">
                <span className="text-violet-400">›</span>
                <span className="w-2 h-4 bg-violet-400 animate-pulse rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
