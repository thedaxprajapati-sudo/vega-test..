import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

export function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === 'signup') {
      if (username.trim().length < 2) {
        setError('Username must be at least 2 characters')
        setLoading(false)
        return
      }
      const { error } = await signUp(email, password, username.trim())
      if (error) setError(error)
    } else {
      const { error } = await signIn(email, password)
      if (error) setError(error)
    }
    setLoading(false)
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">CL</div>
          <h1>ChatLoop</h1>
          <p>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</p>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === 'signin' ? 'active' : ''}
            onClick={() => { setMode('signin'); setError(null) }}
          >
            Sign In
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => { setMode('signup'); setError(null) }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={2}
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
