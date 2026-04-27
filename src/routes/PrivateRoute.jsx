import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

function PrivateRoute() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default PrivateRoute