import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAuth } from '../hooks/userAuth'
import { loginUser } from '../api/authApi'
import '../styles/forms.css'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [pw, setPW] = useState('')
  const [showPW, setShowPW] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = userAuth()
  const navigate = useNavigate()

  const Login = async (e) => {
    e.preventDefault()
    if (loading) return

    const trimmed = username.trim()
    if (!trimmed) { setError('Please enter a username.'); return }
    if (!pw) { setError('Please enter a password.'); return }

    setLoading(true)
    setError(null)

    try {
      const data = await loginUser(trimmed, pw)
      login(data.username, data.display_name)
      navigate('/browse')
    } catch (error) {
      setError(error.message || 'Could not connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <h1>PotaTCG</h1>
      <p>Your Pokémon TCG collection tracker</p>

      <form onSubmit={Login} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
        />

        <div className="password-row">
          <div className="password-input-wrap">
            <input
              type={showPW ? 'text' : 'password'}
              placeholder="Password"
              value={pw}
              onChange={(e) => setPW(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="pw-show-btn"
              onClick={() => setShowPW(v => !v)}
              aria-label={showPW ? 'Hide password' : 'Show password'}
            >
              {showPW ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Log In'}
        </button>

        {error && <p className="error">{error}</p>}

        <button type="button" className="link-btn" onClick={() => navigate('/signup')}>
          Don&apos;t have an account? Sign up
        </button>
      </form>
    </div>
  )
}

export default LoginPage
