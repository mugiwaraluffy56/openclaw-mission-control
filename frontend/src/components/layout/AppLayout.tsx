import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppLayout() {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/auth/login" replace />
  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
