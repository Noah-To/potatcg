import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/forms.css'

function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/browse', { replace: true })
  }, [user, navigate])

  return (
    <div className="login-page">
      <h1>PotaTCG</h1>
      <p>Your Pokémon TCG collection tracker</p>
      <div className="landing-buttons">
        <button className="landing-btn-primary" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
        <button className="landing-btn-secondary" onClick={() => navigate('/login')}>
          Log In
        </button>
      </div>
    </div>
  )
}

export default LandingPage
