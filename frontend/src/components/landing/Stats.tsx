import { useEffect, useRef, useState } from 'react'

const STATS = [
  { value: 12847, label: 'Agents managed', suffix: '+' },
  { value: 4200000000, label: 'Log lines streamed', suffix: '+', compact: true },
  { value: 99.7, label: 'Platform uptime', suffix: '%', decimal: 1 },
  { value: 38, label: 'Countries', suffix: '' },
  { value: 2100, label: 'Teams', suffix: '+' },
]

function useCountUp(target: number, duration = 1500, decimal = 0) {
  const [count, setCount] = useState(0)
  const ref = useRef<boolean>(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(parseFloat((target * ease).toFixed(decimal)))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, decimal])

  return count
}

function StatItem({ value, label, suffix, compact, decimal = 0 }: { value: number; label: string; suffix: string; compact?: boolean; decimal?: number }) {
  const count = useCountUp(value, 1800, decimal)
  const display = compact
    ? count >= 1e9 ? `${(count / 1e9).toFixed(1)}B` : count >= 1e6 ? `${(count / 1e6).toFixed(0)}M` : count.toFixed(0)
    : count.toFixed(decimal)

  return (
    <div className="text-center">
      <p className="font-mono font-black text-3xl text-white tabular-nums">
        {display}<span className="text-rose-400">{suffix}</span>
      </p>
      <p className="text-xs text-zinc-600 mt-1">{label}</p>
    </div>
  )
}

export function Stats() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-surface-1 border border-border-1 rounded-2xl px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {STATS.map((s) => <StatItem key={s.label} {...s} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
