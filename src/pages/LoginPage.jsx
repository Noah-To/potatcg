import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { loginUser } from '../api/authApi'
import '../styles/forms.css'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (loading) return

    const trimmed = username.trim()

    if (!trimmed) {
      setError('Please enter a username.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await loginUser(trimmed)
      login(data.username)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Could not connect to server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <h1>PotaTCG</h1>
      <p>Your Pokemon TCG collection tracker</p>

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Enter'}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}

export default LoginPage