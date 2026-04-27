import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { AppLayout } from './components/layout/AppLayout'
import { AuthLayout } from './components/auth/AuthLayout'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { Overview } from './pages/app/Overview'
import { Agents } from './pages/app/Agents'
import { AgentDetail } from './pages/app/AgentDetail'
import { Logs } from './pages/app/Logs'
import { ActivityPage } from './pages/app/Activity'
import { Settings } from './pages/app/Settings'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 5000 } } })

export function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<Overview />} />
            <Route path="/app/agents" element={<Agents />} />
            <Route path="/app/agents/:id" element={<AgentDetail />} />
            <Route path="/app/logs" element={<Logs />} />
            <Route path="/app/activity" element={<ActivityPage />} />
            <Route path="/app/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1a1a1d', border: '1px solid #2a2a2f', color: '#e4e4e7', fontSize: '13px' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1a1a1d' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1a1a1d' } },
        }}
      />
    </QueryClientProvider>
  )
}
