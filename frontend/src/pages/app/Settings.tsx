import { useAuthStore } from '../../store/auth'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Shield, Key, User, Bell, Trash2 } from 'lucide-react'

export function Settings() {
  const { user, logout } = useAuthStore()

  return (
    <div className="p-5 max-w-2xl space-y-5 animate-fade-in">
      {/* Profile */}
      <Card className="divide-y divide-border-1 overflow-hidden">
        <div className="px-5 py-3.5 flex items-center gap-2">
          <User size={14} className="text-zinc-500" />
          <h3 className="text-sm font-semibold text-white">Profile</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)' }}>
              <span className="text-lg font-bold text-white">{user?.name[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-zinc-500">{user?.email}</p>
            </div>
          </div>
          <Input label="Full Name" defaultValue={user?.name} disabled />
          <Input label="Email" defaultValue={user?.email} disabled />
          <Button variant="secondary" size="sm" disabled>Save changes</Button>
        </div>
      </Card>

      {/* Security */}
      <Card className="divide-y divide-border-1 overflow-hidden">
        <div className="px-5 py-3.5 flex items-center gap-2">
          <Shield size={14} className="text-zinc-500" />
          <h3 className="text-sm font-semibold text-white">Security</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-white">PEM Key Encryption</p>
              <p className="text-2xs text-zinc-600">All private keys are encrypted at rest in the database</p>
            </div>
            <Badge variant="green" dot>Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-white">JWT Authentication</p>
              <p className="text-2xs text-zinc-600">30-day session tokens, server-side validated</p>
            </div>
            <Badge variant="green" dot>Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-white">Agent Isolation</p>
              <p className="text-2xs text-zinc-600">Each user can only access their own agents</p>
            </div>
            <Badge variant="green" dot>Active</Badge>
          </div>
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="divide-y divide-border-1 border-red-500/20 overflow-hidden">
        <div className="px-5 py-3.5 flex items-center gap-2">
          <Trash2 size={14} className="text-red-400" />
          <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-white">Sign out</p>
              <p className="text-2xs text-zinc-600">End your current session</p>
            </div>
            <Button variant="danger" size="sm" onClick={logout}>Sign out</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
