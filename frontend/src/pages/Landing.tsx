import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, Check, Code2, Database, GitBranch, Globe, KeyRound, Layers, LogIn, Radio, ShieldCheck, Terminal, Webhook } from 'lucide-react'
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

function SectionHeader({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-500">{copy}</p>
    </div>
  )
}

function OpsMatrix() {
  const rows = [
    ['Observe', 'Agent status, uptime, PID, CPU, memory, sessions, live logs', '15s refresh'],
    ['Control', 'Start, stop, restart, command runner, config editor', 'SSH backed'],
    ['Coordinate', 'Boards, approvals, team roles, pending invites, audit feed', 'Human review'],
    ['Integrate', 'Webhooks, notification rules, status page, SDK, CI hooks', 'API first'],
  ]
  return (
    <section className="border-y border-border-1 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Operating model"
          title="A control room built for repeated operations."
          copy="ClawDesk is dense by design. It favors sortable rows, compact labels, monospaced values, and direct actions over oversized marketing cards."
        />
        <div className="overflow-hidden rounded-xl border border-border-1 bg-surface-1">
          {rows.map(([mode, detail, cadence]) => (
            <div key={mode} className="grid gap-3 border-b border-border-1 px-4 py-4 last:border-0 md:grid-cols-[160px,1fr,140px]">
              <div className="font-mono text-xs font-semibold text-white">{mode}</div>
              <div className="text-xs leading-5 text-zinc-500">{detail}</div>
              <div className="font-mono text-2xs text-rose-300">{cadence}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkflowBand() {
  const steps = [
    ['01', 'Link host', 'Add hostname, SSH key, and gateway token.'],
    ['02', 'Verify runtime', 'Read status, PID, uptime, config, and sessions.'],
    ['03', 'Operate safely', 'Use approvals, notifications, and audit history around changes.'],
    ['04', 'Scale out', 'Repeat across VPS, cloud, and bare metal OpenClaw hosts.'],
  ]
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Workflow"
          title="From one agent to a managed fleet."
          copy="The public flow mirrors the product: connect infrastructure, verify the gateway, then keep humans in the loop as the fleet grows."
        />
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map(([num, title, copy]) => (
            <div key={num} className="rounded-xl border border-border-1 bg-surface-1 p-4">
              <div className="font-mono text-3xl font-black text-rose-500/30">{num}</div>
              <h3 className="mt-3 text-sm font-semibold text-white">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-zinc-600">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureDeepDive() {
  const items = [
    { icon: Terminal, title: 'Command execution', copy: 'Run controlled SSH commands from an agent detail page and capture stdout, stderr, and action history.' },
    { icon: Radio, title: 'Channel visibility', copy: 'Read Telegram, Discord, and gateway channel metadata so sessions are not hidden inside logs.' },
    { icon: Code2, title: 'Config management', copy: 'Compare JSON config across agents, edit the active config, and restart the gateway after save.' },
    { icon: Webhook, title: 'Webhook routing', copy: 'Store outbound webhook destinations with event filters for automation and incident pipelines.' },
    { icon: ShieldCheck, title: 'Team permissions', copy: 'Invite operators, separate owner/admin/operator/viewer roles, and keep a compact permission matrix.' },
    { icon: Layers, title: 'Skills inventory', copy: 'Track installed runtime skills per agent and expose marketplace-ready metadata for install flows.' },
  ]
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Deep dive"
          title="Feature surfaces map to actual operator jobs."
          copy="Each surface is meant to reduce context switches between terminals, config files, logs, and team coordination tools."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-xl border border-border-1 bg-surface-1 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-300">
                <Icon size={16} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-zinc-600">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RequirementsGrid() {
  const reqs = [
    { icon: Globe, title: 'Any reachable host', copy: 'VPS, cloud instance, homelab server, or bare metal box with SSH access.' },
    { icon: KeyRound, title: 'SSH private key', copy: 'Uploaded by the user and used server-side for lifecycle commands and file reads.' },
    { icon: Database, title: 'SQLite storage', copy: 'Bundled database for users, agents, teams, webhooks, notifications, and audit history.' },
    { icon: GitBranch, title: 'Deployment path', copy: 'Docker files, migrations, CI workflows, Terraform starter, and shell scripts are included.' },
  ]
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Requirements"
          title="No cloud lock-in, no EC2-only assumptions."
          copy="ClawDesk connects to general OpenClaw hosts. The dashboard does not need a provider-specific instance API to do its core job."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {reqs.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex gap-4 rounded-xl border border-border-1 bg-surface-1 p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300">
                <Icon size={17} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-600">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingComparison() {
  const rows = [
    ['Agents', '1', '10', 'Unlimited'],
    ['Live logs', 'Included', 'Included', 'Included'],
    ['Command runner', 'Included', 'Included', 'Included'],
    ['Team members', 'Solo', '3 seats', 'Unlimited'],
    ['Notifications', 'Basic', 'Email + webhook', 'Email + webhook + status'],
    ['Activity retention', '7 days', '30 days', '90 days'],
  ]
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Compare"
          title="The plan difference is operational depth."
          copy="The core dashboard stays useful from day one. Higher tiers add collaboration, longer history, and automation surfaces."
        />
        <div className="overflow-hidden rounded-xl border border-border-1 bg-surface-1">
          <div className="grid grid-cols-4 border-b border-border-1 px-4 py-3 text-2xs font-semibold uppercase tracking-wider text-zinc-600">
            <span>Capability</span><span>Free</span><span>Pro</span><span>Team</span>
          </div>
          {rows.map((row) => (
            <div key={row[0]} className="grid grid-cols-4 border-b border-border-1 px-4 py-3 text-xs last:border-0">
              {row.map((cell, i) => <span key={cell} className={i === 0 ? 'text-white' : 'font-mono text-zinc-500'}>{cell}</span>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    ['Does ClawDesk require a specific cloud?', 'No. It connects to any reachable host running OpenClaw with SSH and a gateway token.'],
    ['Is this only a marketing shell?', 'No. The app routes include fleet overview, agents, logs, activity, boards, approvals, team, webhooks, notifications, analytics, and settings.'],
    ['Where does the logo load from?', 'The app serves the committed asset at /logo.png from the Vite public directory.'],
    ['Can I self-host it?', 'Yes. The repo includes Dockerfiles, Compose wiring, migrations, and deployment starter scripts.'],
  ]
  return (
    <section className="border-t border-border-1 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="FAQ"
          title="Practical answers for operators."
          copy="A few direct answers before someone connects the first agent."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {faqs.map(([q, a]) => (
            <div key={q} className="rounded-xl border border-border-1 bg-surface-1 p-4">
              <h3 className="text-sm font-semibold text-white">{q}</h3>
              <p className="mt-2 text-xs leading-5 text-zinc-600">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Landing() {
  return (
    <PublicShell>
      <Hero />
      <Stats />
      <OpsMatrix />
      <WorkflowBand />
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
      <FAQSection />
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
      <FeatureDeepDive />
      <OpsMatrix />
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
      <RequirementsGrid />
      <WorkflowBand />
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
      <PricingComparison />
      <FAQSection />
    </PublicShell>
  )
}
