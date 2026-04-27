import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../../lib/api'
import { Spinner } from '../../components/ui/Spinner'
import { useAuthStore } from '../../store/auth'

export function OAuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      toast.error('OAuth sign-in failed')
      navigate('/auth/login', { replace: true })
      return
    }
    localStorage.setItem('mc_token', token)
    api.auth.me()
      .then((user) => {
        setAuth(user, token)
        navigate('/app', { replace: true })
      })
      .catch(() => {
        localStorage.removeItem('mc_token')
        toast.error('OAuth session could not be loaded')
        navigate('/auth/login', { replace: true })
      })
  }, [navigate, params, setAuth])

  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <Spinner />
      <p className="text-xs text-zinc-500">Completing sign-in...</p>
    </div>
  )
}
