import { Link } from 'react-router-dom'
import { ArrowRight, LogIn, Zap } from 'lucide-react'
import { Features } from '../components/landing/Features'
import { Hero } from '../components/landing/Hero'
import { HowItWorks } from '../components/landing/HowItWorks'
import { Pricing } from '../components/landing/Pricing'
import { Stats } from '../components/landing/Stats'

export function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080809] text-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#080809]/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
              <Zap size={15} />
            </span>
            <span className="text-sm font-semibold">ClawDesk</span>
          </Link>
          <nav className="hidden items-center gap-5 text-xs text-zinc-500 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how-it-works" className="hover:text-white">Setup</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
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
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
      <footer className="border-t border-border-1 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-zinc-600 md:flex-row md:items-center md:justify-between">
          <span>ClawDesk</span>
          <div className="flex gap-4">
            <Link to="/app" className="hover:text-zinc-300">Dashboard</Link>
            <Link to="/auth/login" className="hover:text-zinc-300">Login</Link>
            <Link to="/auth/signup" className="hover:text-zinc-300">Signup</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
