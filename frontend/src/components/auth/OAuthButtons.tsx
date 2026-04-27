import { Github } from 'lucide-react'
import { Button } from '../ui/Button'

const API_BASE = '/api'

function GoogleIcon() {
  return (
    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-zinc-900">
      G
    </span>
  )
}

export function OAuthButtons({ label = 'Continue' }: { label?: string }) {
  const start = (provider: 'google' | 'github') => {
    window.location.href = `${API_BASE}/auth/${provider}`
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="secondary" size="lg" className="w-full" onClick={() => start('google')}>
        <GoogleIcon /> {label} with Google
      </Button>
      <Button type="button" variant="secondary" size="lg" className="w-full" onClick={() => start('github')}>
        <Github size={14} /> {label} with GitHub
      </Button>
    </div>
  )
}
