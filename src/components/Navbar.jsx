import { Link, useNavigate } from 'react-router-dom'
import { userAuth } from '../hooks/userAuth'
import '../styles/navbar.css'

function Navbar() {
  const { displayName, logout } = userAuth()
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
        <Link to="/account" className="navbar-username">{displayName}</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar