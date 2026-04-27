import clsx from 'clsx'

interface Props {
  children: React.ReactNode
  className?: string
  hover?: boolean
  accent?: string
}

const accentBorder: Record<string, string> = {
  violet: 'border-violet-500/20 hover:border-violet-500/40',
  green: 'border-green-500/20 hover:border-green-500/40',
  blue: 'border-blue-500/20 hover:border-blue-500/40',
  amber: 'border-amber-500/20 hover:border-amber-500/40',
  red: 'border-red-500/20 hover:border-red-500/40',
}

export function Card({ children, className, hover, accent }: Props) {
  return (
    <div className={clsx(
      'bg-surface-1 rounded-xl border transition-colors duration-200',
      accent ? accentBorder[accent] ?? 'border-border-1' : 'border-border-1',
      hover && 'hover:border-border-2 hover:bg-surface-2 cursor-pointer',
      className
    )}>
      {children}
    </div>
  )
}
