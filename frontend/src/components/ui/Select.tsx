import clsx from 'clsx'

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (v: string) => void
  options: Option[]
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function Select({ value, onChange, options, className, placeholder, disabled }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={clsx(
        'h-7 px-2.5 pr-7 rounded-md text-xs text-zinc-300 font-medium',
        'bg-surface-2 border border-border-1 outline-none appearance-none',
        'hover:border-border-2 focus:border-violet-500/50 transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 6px center',
      }}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
