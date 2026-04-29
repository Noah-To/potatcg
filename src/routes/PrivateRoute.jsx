import { Navigate, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { userAuth } from '../hooks/userAuth'

function PrivateRoute() {
  const { user } = userAuth()

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