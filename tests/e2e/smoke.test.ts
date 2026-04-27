// E2E smoke test — requires backend running on localhost:3001
import { describe, it, expect } from 'vitest'

const BASE = 'http://localhost:3001/api'

describe('ClawDesk API smoke tests', () => {
  it('health check passes', async () => {
    const res = await fetch(`${BASE}/health`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
  })

  it('signup → login → me flow', async () => {
    const email = `test+${Date.now()}@example.com`
    const signup = await fetch(`${BASE}/auth/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'test1234', name: 'Test User' })
    })
    expect(signup.status).toBe(200)
    const { token } = await signup.json()
    expect(token).toBeTruthy()

    const me = await fetch(`${BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    expect(me.status).toBe(200)
    const user = await me.json()
    expect(user.email).toBe(email)
  })
})
