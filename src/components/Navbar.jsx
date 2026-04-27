import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/browse" className="navbar-brand">PotaTCG</Link>

      <div className="navbar-links">
        <Link to="/browse">Browse</Link>
        <Link to="/collection">My Collection</Link>
      </div>

      <div className="navbar-user">
        <span>{user}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar