import clsx from 'clsx'

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={clsx('animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500', className ?? 'w-5 h-5')} />
  )
}
