import { Search } from 'lucide-react'
import clsx from 'clsx'

interface FilterOption {
  value: string
  label: string
}

interface Props {
  search: string
  onSearch: (v: string) => void
  placeholder?: string
  filters?: {
    key: string
    value: string
    options: FilterOption[]
    onChange: (v: string) => void
    label?: string
  }[]
  right?: React.ReactNode
  className?: string
}

export function FilterBar({ search, onSearch, placeholder = 'Search...', filters, right, className }: Props) {
  return (
    <div className={clsx('flex items-center gap-2 flex-wrap', className)}>
      <div className="flex items-center gap-2 bg-surface-1 border border-border-1 rounded-lg px-2.5 h-8 flex-1 min-w-40">
        <Search size={12} className="text-zinc-600 flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent flex-1 text-xs text-white placeholder-zinc-700 outline-none"
        />
      </div>
      {filters?.map((f) => (
        <div key={f.key} className="flex items-center gap-1.5">
          {f.label && <span className="text-2xs text-zinc-600">{f.label}</span>}
          <select
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="h-8 px-2.5 pr-7 rounded-lg text-xs text-zinc-300 bg-surface-1 border border-border-1 outline-none appearance-none hover:border-border-2 transition-colors"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 6px center',
            }}
          >
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      {right && <div className="ml-auto">{right}</div>}
    </div>
  )
}
