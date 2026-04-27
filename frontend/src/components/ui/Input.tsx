import clsx from 'clsx'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export function Input({ label, error, hint, icon, className, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-zinc-400">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500">{icon}</div>}
        <input
          className={clsx(
            'w-full h-9 bg-surface-2 border border-border-1 rounded-md text-sm text-white placeholder-zinc-600',
            'focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20',
            'transition-colors duration-150',
            error && 'border-red-500/50',
            icon ? 'pl-9 pr-3' : 'px-3',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-2xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-2xs text-zinc-600">{hint}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-zinc-400">{label}</label>}
      <textarea
        className={clsx(
          'w-full bg-surface-2 border border-border-1 rounded-md text-sm text-white placeholder-zinc-600',
          'focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20',
          'transition-colors duration-150 p-3 resize-none font-mono',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-2xs text-red-400">{error}</p>}
    </div>
  )
}
