import { useEffect, useRef, useState } from 'react'
import CardItem from '../components/CardItem'
import SetItem from '../components/SetItem'
import SearchBar from '../components/SearchBar'
import ErrorMessage from '../components/ErrorMessage'
import ActionButton from '../components/ActionButton'
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
  const [globalSearch, setGlobalSearch] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const isCompoundSearch = useRef(false)

  const { user } = useAuth()
  const { cards, totalCount, loading: cardsLoading, error: cardsError, search: searchCards } = useCards()
  const { sets, loading: setsLoading, error: setsError, search: searchSets } = useSets()

  useEffect(() => {
    searchSets('')
  }, [searchSets])

  useEffect(() => {
    if (!cardsLoading && isCompoundSearch.current) {
      if (cards.length === 0) {
        setSearchError("Make sure you don't have a typo! Check the set and the name of the Pokémon!")
      } else {
        setSearchError(null)
      }
    }
  }, [cardsLoading, cards])

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    setPage(1)
    setSearchError(null)
    isCompoundSearch.current = false

    if (selectedSet) {
      searchCards(trimmed, selectedSet.id, 1)
      return
    }

    if (!trimmed) {
      setGlobalSearch(false)
      searchSets('')
      return
    }

    // Try compound: set name + card name or number in any order
    const compound = parseCompoundQuery(trimmed, sets)
    if (compound) {
      isCompoundSearch.current = true
      setSelectedSet(compound.set)
      setQuery('')
      setPage(1)
      searchCards(compound.cardQuery, compound.set.id, 1)
      return
    }

    // Normal global search
    searchSets(trimmed)
    searchCards(trimmed, '', 1)
    setGlobalSearch(true)
  }

  const handleSetClick = (set) => {
    setSelectedSet(set)
    setQuery('')
    setPage(1)
    searchCards('', set.id, 1)
  }

  const handleBackToSets = () => {
    setSelectedSet(null)
    setGlobalSearch(false)
    setSearchError(null)
    isCompoundSearch.current = false
    setQuery('')
    setPage(1)
    searchSets('')
  }

  const handleNextPage = () => {
    const nextPage = page + 1
    setPage(nextPage)
    if (selectedSet) {
      searchCards(query.trim(), selectedSet.id, nextPage)
    } else if (globalSearch) {
      searchCards(query.trim(), '', nextPage)
    }
  }

  const handlePrevPage = () => {
    if (page === 1) return
    const prevPage = page - 1
    setPage(prevPage)
    if (selectedSet) {
      searchCards(query.trim(), selectedSet.id, prevPage)
    } else if (globalSearch) {
      searchCards(query.trim(), '', prevPage)
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
          loading={selectedSet ? cardsLoading : (setsLoading || cardsLoading)}
        />

        {selectedSet && (
          <ActionButton variant="secondary" onClick={handleBackToSets}>
            Back to sets
          </ActionButton>
        )}
      </div>

      {message && <p className="success">{message}</p>}
      <ErrorMessage message={searchError ?? cardsError ?? setsError} />

      {!selectedSet && !globalSearch && (
        <div className="cards-grid">
          {sets.map(set => (
            <SetItem key={set.id} set={set} onClick={handleSetClick} />
          ))}
        </div>
      )}

      {!selectedSet && globalSearch && (
        <>
          {sets.length > 0 && (
            <>
              <h3 className="search-section-heading">Sets</h3>
              <div className="cards-grid">
                {sets.map(set => (
                  <SetItem key={set.id} set={set} onClick={handleSetClick} />
                ))}
              </div>
            </>
          )}
          <h3 className="search-section-heading">Cards</h3>
          <div className="cards-grid">
            {cards.map(card => (
              <CardItem
                key={card.id}
                card={card}
                onAction={() => handleAdd(card)}
                actionLabel="+ Collection"
              />
            ))}
            {cards.length === 0 && !cardsLoading && <p>No cards found.</p>}
          </div>
        </>
      )}

      {selectedSet && (
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
      )}

      {(selectedSet || globalSearch) && (
        <div className="pagination-row">
          <ActionButton variant="secondary" onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </ActionButton>
          <span>Page {page}</span>
          <ActionButton variant="secondary" onClick={handleNextPage} disabled={page * 20 >= totalCount}>
            Next
          </ActionButton>
        </div>
      )}
    </div>
  )
}

// getting the partial set name + card from a compound search string.
// change the words into lowercase, trim whitespace and split them into parts to match prefixes of the set and pokemon names
function parseCompoundQuery(query, sets) {
  const words = query.toLowerCase().trim().split(/\s+/)
  if (words.length < 2) return null

  //string manipulation of comparing the front and back of the query to the names of the set
  for (let len = words.length - 1; len >= 1; len--) {
    const setPart = words.slice(0, len).join(' ')
    const cardPart = words.slice(len).join(' ')
    if (cardPart) {
      const matched = sets.find(s => s.name.toLowerCase().startsWith(setPart))
      if (matched) return { set: matched, cardQuery: cardPart }
    }

    const setPart2 = words.slice(words.length - len).join(' ')
    const cardPart2 = words.slice(0, words.length - len).join(' ')
    if (cardPart2) {
      const matched = sets.find(s => s.name.toLowerCase().startsWith(setPart2))
      if (matched) return { set: matched, cardQuery: cardPart2 }
    }
  }
  return null
}
export default BrowsePage