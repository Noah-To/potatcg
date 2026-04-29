import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAuth } from '../hooks/userAuth'
import { registerUser } from '../api/authApi'
import '../styles/forms.css'

// password must be at least 12 chars, 1 uppercase, 1 number, 1 symbol, no whitespace
// a regex to check 
const pw_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s])\S{12,}$/

function SignUpPage() {
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = userAuth()
  const navigate = useNavigate()

  // handle the login, validating the password with regex and 
  // check for whitespaces in the username catches error before 
  // sending the request to the server
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const trimmed = username.trim()
    if (!trimmed) { setError('Please enter a username.'); return }
    if (!pw_REGEX.test(password)) {
      setError('Password does not meet the requirements.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const trimmedDisplay = displayName.trim() || trimmed
      const data = await registerUser(trimmed, password, trimmedDisplay)
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
      <p>Create your account</p>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username (used to log in)"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="text"
          placeholder="Display name (shown in the app)"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          disabled={loading}
        />

        <div className="password-row">
          <div className="password-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="pw-show-btn"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="button"
            className={`pw-hint-btn${showHint ? ' active' : ''}`}
            onClick={() => setShowHint(h => !h)}
            aria-label="Password requirements"
          >
            ?
          </button>
        </div>

        {showHint && (
          <div className="pw-hint-box">
            <p>Password must have:</p>
            <ul>
              <li>At least 12 characters</li>
              <li>At least 1 uppercase letter</li>
              <li>At least 1 number</li>
              <li>At least 1 symbol (e.g. ! @ # $)</li>
              <li>No spaces</li>
            </ul>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        {error && <p className="error">{error}</p>}

        <button type="button" className="link-btn" onClick={() => navigate('/login')}>
          {"Log in here if you have an account"}
        </button>
      </form>
    </div>
  )
}

export default SignUpPage
