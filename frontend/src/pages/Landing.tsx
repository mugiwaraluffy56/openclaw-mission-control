import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, LogIn } from 'lucide-react'
import { Features } from '../components/landing/Features'
import { Hero } from '../components/landing/Hero'
import { HowItWorks } from '../components/landing/HowItWorks'
import { Pricing } from '../components/landing/Pricing'
import { Stats } from '../components/landing/Stats'

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-[#080809] text-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#080809]/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ClawDesk" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-sm font-semibold">ClawDesk</span>
          </Link>
          <nav className="hidden items-center gap-5 text-xs text-zinc-500 md:flex">
            {[
              { to: '/features', label: 'Features' },
              { to: '/setup', label: 'Setup' },
              { to: '/pricing', label: 'Pricing' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => isActive ? 'text-white' : 'hover:text-white'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth/login" className="hidden h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-white sm:flex">
              <LogIn size={13} /> Sign in
            </Link>
            <Link to="/auth/signup" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-500">
              Get started <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>
      <main className="pt-14">
        {children}
      </main>
      <footer className="border-t border-border-1 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-zinc-600 md:flex-row md:items-center md:justify-between">
          <span>ClawDesk</span>
          <div className="flex gap-4">
            <Link to="/features" className="hover:text-zinc-300">Features</Link>
            <Link to="/setup" className="hover:text-zinc-300">Setup</Link>
            <Link to="/pricing" className="hover:text-zinc-300">Pricing</Link>
            <Link to="/app" className="hover:text-zinc-300">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="px-6 pb-4 pt-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">{copy}</p>
      </div>
    </section>
  )
}

export function Landing() {
  return (
    <PublicShell>
      <Hero />
      <Stats />
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-3">
          {[
            ['Fleet control', 'Monitor status, logs, sessions, and config from one dense dashboard.'],
            ['Human oversight', 'Approvals, activity, notifications, and team workflows stay visible.'],
            ['OpenClaw native', 'Connect any VPS, cloud host, or bare metal server running OpenClaw.'],
          ].map(([title, copy]) => (
            <Link key={title} to="/features" className="rounded-xl border border-border-1 bg-surface-1 p-4 hover:border-rose-500/30">
              <h2 className="text-sm font-semibold text-white">{title}</h2>
              <p className="mt-2 text-xs leading-5 text-zinc-600">{copy}</p>
            </Link>
          ))}
        </div>
      </section>
    </PublicShell>
  )
}

export function FeaturesPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Features"
        title="Everything ClawDesk needs to operate an OpenClaw fleet."
        copy="Inspect agents, stream logs, run commands, edit configs, manage teams, and keep operational signals in view without leaving the browser."
      />
      <Features />
    </PublicShell>
  )
}

export function SetupPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Setup"
        title="Connect an OpenClaw host in minutes."
        copy="ClawDesk is built around a general SSH connection flow: hostname, private key, and gateway token. No cloud-specific assumptions."
      />
      <HowItWorks />
    </PublicShell>
  )
}

export function PricingPage() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Pricing"
        title="Pick the plan that matches your fleet."
        copy="Start with one agent, then add team controls, notifications, webhooks, and fleet analytics as your deployment grows."
      />
      <Pricing />
    </PublicShell>
  )
}
