import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="page" style={{ paddingTop: '4rem' }}>
      <h2>404 — Page Not Found</h2>
      <p style={{ color: '#aaa' }}>That page doesn't exist.</p>
      <Link to="/" style={{ color: '#f5c518' }}>Go back home</Link>
    </div>
  )
}

export default NotFoundPage
