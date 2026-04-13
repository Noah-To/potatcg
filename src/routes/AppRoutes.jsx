import { Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import BrowsePage from '../pages/BrowsePage'
import CollectionPage from '../pages/CollectionPage'
import NotFoundPage from '../pages/NotFoundPage'
import PrivateRoute from './PrivateRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/collection" element={<CollectionPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
