import clsx from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down' | 'flat'
  trendLabel?: string
  icon?: React.ReactNode
  color?: 'rose' | 'green' | 'blue' | 'amber' | 'red' | 'zinc'
  className?: string
}

const colorMap = {
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', icon: 'text-rose-400' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', icon: 'text-green-400' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: 'text-blue-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: 'text-amber-400' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: 'text-red-400' },
  zinc: { bg: 'bg-white/5', border: 'border-white/8', text: 'text-zinc-400', icon: 'text-zinc-500' },
}

export function MetricCard({ label, value, sub, trend, trendLabel, icon, color = 'zinc', className }: Props) {
  const c = colorMap[color]
  return (
    <div className={clsx('bg-surface-1 border border-border-1 rounded-xl p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-2xs font-semibold uppercase tracking-wider text-zinc-600">{label}</span>
        {icon && (
          <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center', c.bg, c.border, 'border')}>
            <span className={c.icon}>{icon}</span>
          </div>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className={clsx('font-mono font-bold tabular-nums', typeof value === 'number' || String(value).match(/^\d/) ? 'text-2xl' : 'text-xl', 'text-white')}>{value}</span>
        {trend && (
          <div className={clsx('flex items-center gap-1 text-2xs font-medium pb-0.5',
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-zinc-500'
          )}>
            {trend === 'up' ? <TrendingUp size={10} /> : trend === 'down' ? <TrendingDown size={10} /> : <Minus size={10} />}
            {trendLabel}
          </div>
        )}
      </div>
      {sub && <p className="text-2xs text-zinc-600">{sub}</p>}
    </div>
  )
}
