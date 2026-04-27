import clsx from 'clsx'

interface Props { active: boolean; size?: 'sm' | 'md' }

export function StatusDot({ active, size = 'sm' }: Props) {
  const sz = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'
  return (
    <span className={clsx('relative flex flex-shrink-0', sz)}>
      {active && <span className={clsx('animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60')} />}
      <span className={clsx('relative inline-flex rounded-full', sz, active ? 'bg-green-500' : 'bg-zinc-600')} />
    </span>
  )
}
