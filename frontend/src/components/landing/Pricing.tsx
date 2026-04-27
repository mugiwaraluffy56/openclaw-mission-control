import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'For individuals running a single agent.',
    features: [
      '1 agent',
      'Live log streaming',
      'SSH command runner',
      'Config editor',
      '7-day activity history',
      'Community support',
    ],
    cta: 'Get started',
    ctaTo: '/auth/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    desc: 'For power users with multiple agents.',
    features: [
      '10 agents',
      'Everything in Free',
      'Team members (up to 3)',
      'API key access',
      '30-day activity history',
      'Email notifications',
      'Webhook integrations',
      'Priority support',
    ],
    cta: 'Start free trial',
    ctaTo: '/auth/signup',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: 'per month',
    desc: 'For teams running production fleets.',
    features: [
      'Unlimited agents',
      'Everything in Pro',
      'Unlimited team members',
      'Role-based access control',
      '90-day activity history',
      'Slack/Discord/PagerDuty',
      'Public status page',
      'Custom webhooks',
      'SLA + dedicated support',
    ],
    cta: 'Start free trial',
    ctaTo: '/auth/signup',
    highlight: false,
  },
]

export function Pricing() {
  return (
    <section className="py-20 px-6" id="pricing">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">Pricing</p>
          <h2 className="text-3xl font-bold text-white">Simple, predictable pricing</h2>
          <p className="text-sm text-zinc-500">No per-agent fees. No surprise bills. Start free, upgrade when you need to.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-violet-600/5 border-violet-500/40 ring-1 ring-violet-500/20'
                  : 'bg-surface-1 border-border-1'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-2xs font-bold px-3 py-1 rounded-full">Most popular</span>
                </div>
              )}
              <div className="mb-4">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{plan.name}</p>
                <div className="flex items-baseline gap-1.5 mt-1.5 mb-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-zinc-600">/{plan.period}</span>
                </div>
                <p className="text-xs text-zinc-500">{plan.desc}</p>
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={12} className="text-violet-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-zinc-400">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={plan.ctaTo}
                className={`w-full h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-violet-600 hover:bg-violet-500 text-white'
                    : 'bg-surface-2 hover:bg-surface-3 text-zinc-300 border border-border-2'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
