import { useEffect, useState } from 'react'
import CardItem from '../components/CardItem'
import SetItem from '../components/SetItem'
import SearchBar from '../components/SearchBar'
import ErrorMessage from '../components/ErrorMessage'
import { useAuth } from '../hooks/useAuth'
import { useCards } from '../hooks/useCards'
import { useSets } from '../hooks/useSets'
import { addCard } from '../api/collectionApi'
import '../styles/cards.css'

function BrowsePage() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState(null)
  const [selectedSet, setSelectedSet] = useState(null)

  const { user } = useAuth()
  const { cards, loading: cardsLoading, error: cardsError, search: searchCards } = useCards()
  const { sets, loading: setsLoading, error: setsError, search: searchSets } = useSets()

  useEffect(() => {
    searchSets('')
  }, [searchSets])

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    setPage(1)

    if (selectedSet) {
      searchCards(trimmed, selectedSet.id, 1)
    } else {
      searchSets(trimmed)
    }
  }

  const handleSetClick = (set) => {
    setSelectedSet(set)
    setQuery('')
    setPage(1)
    searchCards('', set.id, 1)
  }

  const handleBackToSets = () => {
    setSelectedSet(null)
    setQuery('')
    setPage(1)
    searchSets('')
  }

  const handleNextPage = () => {
    const nextPage = page + 1
    setPage(nextPage)
    if (selectedSet) {
      searchCards(query.trim(), selectedSet.id, nextPage)
    }
  }

  const handlePrevPage = () => {
    if (page === 1) return
    const prevPage = page - 1
    setPage(prevPage)
    if (selectedSet) {
      searchCards(query.trim(), selectedSet.id, prevPage)
    }
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
      <div className="controls-row">
        <SearchBar
          query={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          loading={selectedSet ? cardsLoading : setsLoading}
        />

        {selectedSet && (
          <button type="button" className="secondary-btn" onClick={handleBackToSets}>
            Back to sets
          </button>
        )}
      </div>

      {message && <p className="success">{message}</p>}
      <ErrorMessage message={selectedSet ? cardsError : setsError} />

      <div className="cards-grid">
        {!selectedSet &&
          sets.map(set => (
            <SetItem key={set.id} set={set} onClick={handleSetClick} />
          ))}

        {selectedSet &&
          cards.map(card => (
            <CardItem
              key={card.id}
              card={card}
              onAction={() => handleAdd(card)}
              actionLabel="+ Collection"
            />
          ))}
      </div>

      {selectedSet && (
        <div className="pagination-row">
          <button type="button" className="secondary-btn" onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page}</span>
          <button type="button" className="secondary-btn" onClick={handleNextPage}>
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default BrowsePage