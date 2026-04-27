import clsx from 'clsx'

interface Props {
  children: React.ReactNode
  variant?: 'violet' | 'green' | 'blue' | 'red' | 'amber' | 'gray'
  dot?: boolean
}

const variants = {
  violet: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  gray: 'bg-white/5 text-zinc-400 border-white/8',
}

const dotColors = {
  violet: 'bg-violet-400', green: 'bg-green-400', blue: 'bg-blue-400',
  red: 'bg-red-400', amber: 'bg-amber-400', gray: 'bg-zinc-500',
}

export function Badge({ children, variant = 'gray', dot }: Props) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-2xs font-medium border', variants[variant])}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />}
      {children}
    </span>
  )
}
