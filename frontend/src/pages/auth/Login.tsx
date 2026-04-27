import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import { OAuthButtons } from '../../components/auth/OAuthButtons'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const login = useMutation({
    mutationFn: () => api.auth.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate('/app')
    },
    onError: () => toast.error('Invalid credentials'),
  })

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
      <p className="text-sm text-zinc-500 mb-7">Sign in to your ClawDesk account</p>

      <OAuthButtons label="Continue" />

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border-1" />
        <span className="text-2xs uppercase tracking-wider text-zinc-700">or</span>
        <div className="h-px flex-1 bg-border-1" />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); login.mutate() }} className="space-y-4">
        <Input
          label="Email" type="email" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={13} />} required
        />
        <div className="relative">
          <Input
            label="Password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={13} />} required
          />
          <button type="button" onClick={() => setShowPw((p) => !p)}
            className="absolute right-2.5 top-7 text-zinc-600 hover:text-zinc-400">
            {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" loading={login.isPending}>
          Sign in
        </Button>
      </form>

      <p className="text-xs text-zinc-600 text-center mt-5">
        Don't have an account?{' '}
        <Link to="/auth/signup" className="text-rose-400 hover:text-rose-300">Sign up</Link>
      </p>
    </div>
  )
}
