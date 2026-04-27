import clsx from 'clsx'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary: 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-500',
  secondary: 'bg-surface-2 hover:bg-surface-3 text-white border border-border-1 hover:border-border-2',
  danger: 'bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/20 hover:border-red-600/40',
  ghost: 'hover:bg-surface-2 text-zinc-400 hover:text-white border border-transparent',
  outline: 'bg-transparent hover:bg-surface-2 text-zinc-300 border border-border-2 hover:border-border-3',
}
const sizes = {
  xs: 'h-6 px-2 text-2xs gap-1',
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-8 px-3 text-sm gap-2',
  lg: 'h-10 px-4 text-sm gap-2',
}

export function Button({ variant = 'secondary', size = 'sm', loading, className, children, disabled, ...props }: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {loading ? <span className="animate-spin w-3 h-3 border border-current border-t-transparent rounded-full" /> : children}
    </button>
  )
}
