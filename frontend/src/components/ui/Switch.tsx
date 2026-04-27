import clsx from 'clsx'

interface Props {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
}

export function Switch({ checked, onChange, disabled, label, description }: Props) {
  return (
    <label className={clsx('flex items-center gap-3 cursor-pointer group', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent',
          'transition-colors duration-200 focus:outline-none',
          checked ? 'bg-rose-600' : 'bg-surface-3'
        )}
      >
        <span
          className={clsx(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow',
            'transition-transform duration-200',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </button>
      {(label || description) && (
        <div>
          {label && <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{label}</p>}
          {description && <p className="text-2xs text-zinc-600">{description}</p>}
        </div>
      )}
    </label>
  )
}
