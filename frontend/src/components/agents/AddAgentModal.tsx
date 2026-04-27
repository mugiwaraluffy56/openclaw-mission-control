import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Modal } from '../ui/Modal'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { api } from '../../lib/api'
import { CreateAgentForm } from '../../types'
import { Info } from 'lucide-react'

interface Props { open: boolean; onClose: () => void }

const ACCENTS = ['violet', 'green', 'blue', 'amber', 'red']

const STEPS = ['Basic Info', 'Connection', 'Config']

export function AddAgentModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0)
  const qc = useQueryClient()
  const [form, setForm] = useState<CreateAgentForm>({
    name: '', ip: '', pem_content: '', gateway_token: '',
    model: 'claude-cli/claude-haiku-4-5', accent: 'violet', description: '',
  })

  const set = (k: keyof CreateAgentForm, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const create = useMutation({
    mutationFn: () => api.agents.create(form),
    onSuccess: () => {
      toast.success(`Agent "${form.name}" added`)
      qc.invalidateQueries({ queryKey: ['agents'] })
      onClose()
      setStep(0)
      setForm({ name: '', ip: '', pem_content: '', gateway_token: '', model: 'claude-cli/claude-haiku-4-5', accent: 'violet', description: '' })
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <Modal open={open} onClose={onClose} title="Link New Agent" width="max-w-lg">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-2xs font-semibold flex-shrink-0 ${i <= step ? 'bg-violet-600 text-white' : 'bg-surface-3 text-zinc-600'}`}>{i + 1}</div>
            <div className="flex-1 mx-1.5">
              <p className={`text-2xs ${i <= step ? 'text-zinc-300' : 'text-zinc-600'}`}>{s}</p>
              {i < STEPS.length - 1 && <div className={`h-px mt-1 ${i < step ? 'bg-violet-600' : 'bg-surface-3'}`} />}
            </div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <Input label="Agent Name" placeholder="e.g. Stella" value={form.name} onChange={(e) => set('name', e.target.value)} />
          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1.5">Accent Color</label>
            <div className="flex gap-2">
              {ACCENTS.map((a) => (
                <button key={a} onClick={() => set('accent', a)} className={`w-7 h-7 rounded-lg border-2 transition-all ${form.accent === a ? 'border-white scale-110' : 'border-transparent opacity-60'}`}
                  style={{ background: a === 'violet' ? '#7c3aed' : a === 'green' ? '#16a34a' : a === 'blue' ? '#1d4ed8' : a === 'amber' ? '#d97706' : '#dc2626' }} />
              ))}
            </div>
          </div>
          <Input label="Description (optional)" placeholder="What does this agent do?" value={form.description} onChange={(e) => set('description', e.target.value)} />
          <Input label="Model" placeholder="claude-cli/claude-haiku-4-5" value={form.model} onChange={(e) => set('model', e.target.value)} />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Input label="Server IP" placeholder="13.48.46.238" value={form.ip} onChange={(e) => set('ip', e.target.value)} />
          <Input label="Gateway Token" placeholder="your-openclaw-gateway-token" value={form.gateway_token} onChange={(e) => set('gateway_token', e.target.value)} />
          <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/15 rounded-lg">
            <Info size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-2xs text-zinc-500">Find your gateway token in <code className="text-zinc-400">~/.openclaw/openclaw.json</code> under <code className="text-zinc-400">gateway.auth.token</code></p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Textarea
            label="PEM Key Content"
            placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;Paste your .pem file contents here&#10;-----END RSA PRIVATE KEY-----"
            rows={10}
            value={form.pem_content}
            onChange={(e) => set('pem_content', e.target.value)}
          />
          <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg">
            <Info size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-2xs text-zinc-500">Your PEM key is stored encrypted in the database and used only for SSH connections to your server.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-6 pt-4 border-t border-border-1">
        <Button variant="ghost" onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}>
          {step === 0 ? 'Cancel' : 'Back'}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button variant="primary" onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.name || step === 1 && (!form.ip || !form.gateway_token)}>
            Next →
          </Button>
        ) : (
          <Button variant="primary" onClick={() => create.mutate()} loading={create.isPending} disabled={!form.pem_content}>
            Link Agent
          </Button>
        )}
      </div>
    </Modal>
  )
}
