import { useState } from 'react'

interface Props { children: React.ReactNode; content: string }

export function Tooltip({ children, content }: Props) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-surface-4 border border-border-2 rounded text-2xs text-zinc-300 whitespace-nowrap z-50 pointer-events-none">
          {content}
        </div>
      )}
    </div>
  )
}
