import { X } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from './Button'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: string
}

export function Modal({ open, onClose, title, children, width = 'max-w-xl' }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${width} bg-surface-1 border border-border-2 rounded-2xl shadow-2xl animate-slide-up`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-1">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <Button variant="ghost" size="xs" onClick={onClose}><X size={14} /></Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
