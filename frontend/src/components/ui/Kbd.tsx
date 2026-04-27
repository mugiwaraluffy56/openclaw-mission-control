import clsx from 'clsx'

interface Props {
  children: React.ReactNode
  className?: string
}

export function Kbd({ children, className }: Props) {
  return (
    <kbd className={clsx(
      'inline-flex items-center px-1.5 py-0.5 rounded text-2xs font-mono font-medium',
      'bg-surface-3 border border-border-2 text-zinc-400',
      className
    )}>
      {children}
    </kbd>
  )
}
