import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import BrowsePage from '../pages/BrowsePage'
import CollectionPage from '../pages/CollectionPage'
import AccountPage from '../pages/AccountPage'
import NotFoundPage from '../pages/NotFoundPage'
import PrivateRoute from './PrivateRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
