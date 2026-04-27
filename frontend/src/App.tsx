import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { AppLayout } from './components/layout/AppLayout'
import { AuthLayout } from './components/auth/AuthLayout'
import { FeaturesPage, Landing, PricingPage, SetupPage } from './pages/Landing'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { Overview } from './pages/app/Overview'
import { Agents } from './pages/app/Agents'
import { AgentDetail } from './pages/app/AgentDetail'
import { Logs } from './pages/app/Logs'
import { ActivityPage } from './pages/app/Activity'
import { Settings } from './pages/app/Settings'
import {
  Analytics,
  ApiKeysSettings,
  Approvals,
  Boards,
  Channels,
  ConfigManager,
  CreateBoard,
  InstalledSkills,
  NotificationSettings,
  Notifications,
  Organization,
  ProfileSettings,
  SecuritySettings,
  Sessions,
  SkillsMarketplace,
  StatusPage,
  Team,
  Webhooks,
  BillingSettings,
} from './pages/app/Operations'

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 5000 } } })

export function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/pricing" element={<PricingPage />} />
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
            <Route path="/app/boards" element={<Boards />} />
            <Route path="/app/boards/new" element={<CreateBoard />} />
            <Route path="/app/approvals" element={<Approvals />} />
            <Route path="/app/team" element={<Team />} />
            <Route path="/app/skills" element={<SkillsMarketplace />} />
            <Route path="/app/skills/installed" element={<InstalledSkills />} />
            <Route path="/app/channels" element={<Channels />} />
            <Route path="/app/sessions" element={<Sessions />} />
            <Route path="/app/config" element={<ConfigManager />} />
            <Route path="/app/analytics" element={<Analytics />} />
            <Route path="/app/notifications" element={<Notifications />} />
            <Route path="/app/webhooks" element={<Webhooks />} />
            <Route path="/app/status" element={<StatusPage />} />
            <Route path="/app/settings" element={<Settings />} />
            <Route path="/app/settings/profile" element={<ProfileSettings />} />
            <Route path="/app/settings/security" element={<SecuritySettings />} />
            <Route path="/app/settings/api-keys" element={<ApiKeysSettings />} />
            <Route path="/app/settings/billing" element={<BillingSettings />} />
            <Route path="/app/settings/notifications" element={<NotificationSettings />} />
            <Route path="/app/organization" element={<Organization />} />
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
