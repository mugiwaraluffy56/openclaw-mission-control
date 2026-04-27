import clsx from 'clsx'

interface Props {
  value: number
  max?: number
  className?: string
  color?: 'violet' | 'green' | 'blue' | 'amber' | 'red'
  size?: 'xs' | 'sm' | 'md'
}

const colorMap = {
  violet: 'bg-violet-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
}

const sizeMap = {
  xs: 'h-0.5',
  sm: 'h-1',
  md: 'h-1.5',
}

export function Progress({ value, max = 100, className, color = 'violet', size = 'sm' }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={clsx('w-full rounded-full bg-surface-3', sizeMap[size], className)}>
      <div
        className={clsx('h-full rounded-full transition-all duration-300', colorMap[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
