import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function generateFleetData() {
  const now = Date.now()
  return Array.from({ length: 24 }, (_, i) => {
    const h = new Date(now - (23 - i) * 3600000)
    const base = 4 + Math.floor(Math.random() * 3)
    return {
      time: h.getHours().toString().padStart(2, '0') + ':00',
      online: base,
      offline: Math.floor(Math.random() * 2),
      logs: Math.floor(Math.random() * 2000) + 500,
    }
  })
}

const data = generateFleetData()

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-2 border border-border-2 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-500 mb-1 font-mono">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-mono">
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

interface Props {
  type?: 'area' | 'bar'
  title: string
  sub?: string
  dataKey?: string | string[]
}

export function FleetChart({ type = 'area', title, sub, dataKey = 'online' }: Props) {
  const keys = Array.isArray(dataKey) ? dataKey : [dataKey]
  const colors = ['#ff0844', '#22c55e', '#ffb199', '#f59e0b']

  return (
    <div className="bg-surface-1 border border-border-1 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-white">{title}</p>
          {sub && <p className="text-2xs text-zinc-600 mt-0.5">{sub}</p>}
        </div>
        <span className="text-2xs text-zinc-600 font-mono">Last 24h</span>
      </div>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                {keys.map((k, i) => (
                  <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[i]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors[i]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e22" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#52525b' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 9, fill: '#52525b' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {keys.map((k, i) => (
                <Area key={k} type="monotone" dataKey={k} stroke={colors[i]} strokeWidth={1.5} fill={`url(#grad-${k})`} dot={false} />
              ))}
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e22" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#52525b' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 9, fill: '#52525b' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {keys.map((k, i) => (
                <Bar key={k} dataKey={k} fill={colors[i]} radius={[2, 2, 0, 0]} opacity={0.8} />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
