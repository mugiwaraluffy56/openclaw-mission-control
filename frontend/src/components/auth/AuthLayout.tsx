import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

export function AuthLayout() {
  const { token } = useAuthStore()
  if (token) return <Navigate to="/app" replace />
  return (
    <div className="min-h-screen bg-surface-0 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[420px] bg-surface-1 border-r border-border-1 p-10 flex-shrink-0">
        <div className="flex items-center gap-2.5 mb-12">
          <img src="/logo.png" alt="ClawDesk" className="h-8 w-8 rounded-lg object-contain" />
          <span className="font-bold text-white text-sm">ClawDesk</span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
            Control every agent from one place.
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed mb-8">
            Multi-tenant dashboard to manage, monitor, and control your OpenClaw AI agent instances running on any VPS.
          </p>
          <div className="space-y-3">
            {[
              'Real-time log streaming from any instance',
              'One-click restart, stop, and start',
              'Live config editor with instant apply',
              'Session viewer and activity tracking',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                <div className="w-4 h-4 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border-1 pt-6">
          <p className="text-2xs text-zinc-700">Private key material is never returned by API responses. Use encrypted storage for production deployments.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="/logo.png" alt="ClawDesk" className="h-7 w-7 rounded-lg object-contain" />
            <span className="font-bold text-white text-sm">ClawDesk</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
