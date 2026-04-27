import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/auth'

export function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const signup = useMutation({
    mutationFn: () => api.auth.signup(email, password, name),
    onSuccess: (data) => { setAuth(data.user, data.token); navigate('/app') },
    onError: (e: Error) => toast.error(e.message.includes('409') ? 'Email already exists' : 'Signup failed'),
  })

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
      <p className="text-sm text-zinc-500 mb-7">Start managing your OpenClaw agents</p>

      <form onSubmit={(e) => { e.preventDefault(); signup.mutate() }} className="space-y-4">
        <Input label="Full Name" placeholder="Puneeth Aditya" value={name} onChange={(e) => setName(e.target.value)} icon={<User size={13} />} required />
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={13} />} required />
        <div className="relative">
          <Input label="Password" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock size={13} />} required
            hint="Minimum 8 characters" />
          <button type="button" onClick={() => setShowPw((p) => !p)} className="absolute right-2.5 top-7 text-zinc-600 hover:text-zinc-400">
            {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={signup.isPending}>
          Create account
        </Button>
      </form>

      <p className="text-2xs text-zinc-700 text-center mt-4">By signing up you agree to our terms. PEM keys are encrypted at rest.</p>
      <p className="text-xs text-zinc-600 text-center mt-3">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-violet-400 hover:text-violet-300">Sign in</Link>
      </p>
    </div>
  )
}
