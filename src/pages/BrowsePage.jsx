import { useState } from 'react'
import CardItem from '../components/CardItem'
import SearchBar from '../components/SearchBar'
import ErrorMessage from '../components/ErrorMessage'
import { useAuth } from '../hooks/useAuth'
import { useCards } from '../hooks/useCards'
import { addCard } from '../api/collectionApi'
import '../styles/cards.css'

function BrowsePage() {
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState(null)
  const { user } = useAuth()
  const { cards, loading, error, search } = useCards()

  const handleSearch = (e) => {
  e.preventDefault()
  const trimmed = query.trim()
  if (!trimmed) return
  search(trimmed)
  }

  const handleAdd = async (card) => {
    try {
      await addCard(user, card)
      setMessage(`${card.name} added to collection!`)
      setTimeout(() => setMessage(null), 2500)
    } catch {
      setMessage(null)
    }
  }

  return (
    <div className="page">
      <SearchBar query={query} onChange={setQuery} onSubmit={handleSearch} loading={loading} />
      {message && <p className="success">{message}</p>}
      <ErrorMessage message={error} />
      <div className="cards-grid">
        {cards.map(card => (
          <CardItem
            key={card.id}
            card={card}
            onAction={() => handleAdd(card)}
            actionLabel="+ Collection"
          />
        ))}
      </div>
    </div>
  )
}

export default BrowsePage
