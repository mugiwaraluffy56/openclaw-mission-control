import clsx from 'clsx'

interface Tab { id: string; label: string; icon?: React.ReactNode; count?: number }

interface Props {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex items-center gap-0.5 border-b border-border-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'flex items-center gap-1.5 px-3 h-10 text-xs font-medium transition-colors border-b-2 -mb-px',
            active === tab.id
              ? 'text-white border-rose-500'
              : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:border-zinc-700'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={clsx('px-1.5 py-0.5 rounded text-2xs', active === tab.id ? 'bg-rose-500/20 text-rose-300' : 'bg-surface-3 text-zinc-500')}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
