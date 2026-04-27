import { Link } from 'react-router-dom'
import clsx from 'clsx'

interface Crumb {
  label: string
  to?: string
}

interface Props {
  crumbs: Crumb[]
  className?: string
}

export function Breadcrumb({ crumbs, className }: Props) {
  return (
    <nav className={clsx('flex items-center gap-1', className)}>
      {crumbs.map((c, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-zinc-700 text-xs">/</span>}
          {c.to ? (
            <Link to={c.to} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">{c.label}</Link>
          ) : (
            <span className="text-xs text-zinc-400">{c.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
