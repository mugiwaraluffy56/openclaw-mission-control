interface Props { icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode }

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="p-3 bg-surface-2 rounded-xl border border-border-1 text-zinc-500">{icon}</div>
      <div>
        <p className="text-sm font-medium text-zinc-300">{title}</p>
        {description && <p className="text-xs text-zinc-600 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}
