import { useEffect, useRef, useState } from 'react'
import Card from '../components/CardItem'
import Set from '../components/SetItem'
import SearchBar from '../components/SearchBar'
import ErrorMessage from '../components/ErrorMessage'
import Button from '../components/ActionButton'
import { userAuth } from '../hooks/userAuth'
import { userCards } from '../hooks/userCards'
import { useSets } from '../hooks/useSets'
import { addCard } from '../api/collectionApi'
import '../styles/cards.css'

function BrowsePage() {
  const [page, setPage] = useState(1)
  const [setsPage, setSetsPage] = useState(1)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState(null)
  const [selectedSet, setSelectedSet] = useState(null)

  //global search is when user searches for a pokemon without selecting the set
  const [globalSearch, setGlobalSearch] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const isConbinedSearch = useRef(false)

  const { user } = userAuth()
  const { cards, totalCount, loading: cardsLoading, error: cardsError, search: searchCards } = userCards()
  const { sets, totalCount: setsTotalCount, loading: setsLoading, error: setsError, search: searchSets } = useSets()

  useEffect(() => {
    searchSets('', 1)
  }, [searchSets])

  // checking for compounded search before handling other types of seearches
  useEffect(() => {
    if (!cardsLoading && isConbinedSearch.current) {
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
    isConbinedSearch.current = false

    if (selectedSet) {
      searchCards(trimmed, selectedSet.id, 1)
      return
    }

    if (!trimmed) {
      setGlobalSearch(false)
      setSetsPage(1)
      searchSets('', 1)
      return
    }

    // this is compound search or combined search, where the set name + pokemon
    // name or set name are in the same search string
    const compound = parseCompoundQuery(trimmed, sets)
    if (compound) {
      isConbinedSearch.current = true
      setSelectedSet(compound.set)
      setQuery('')
      setPage(1)
      searchCards(compound.cardQuery, compound.set.id, 1)
      return
    }

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
    isConbinedSearch.current = false
    setQuery('')
    setPage(1)
    setSetsPage(1)
    searchSets('', 1)
  }

  const handleSetsNextPage = () => {
    const next = setsPage + 1
    setSetsPage(next)
    searchSets(query.trim(), next)
  }

  const handleSetsPrevPage = () => {
    if (setsPage === 1) return
    const prev = setsPage - 1
    setSetsPage(prev)
    searchSets(query.trim(), prev)
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
          <Button variant="secondary" onClick={handleBackToSets}>
            Back to sets
          </Button>
        )}
      </div>

      {message && <p className="success">{message}</p>}
      <ErrorMessage message={searchError ?? cardsError ?? setsError} />

      {!selectedSet && !globalSearch && (
        <>
          <div className="cards-grid">
            {sets.map(set => (
              <Set key={set.id} set={set} onClick={handleSetClick} />
            ))}
          </div>
          {setsTotalCount > 20 && (
            <div className="pagination-row">
              <Button variant="secondary" onClick={handleSetsPrevPage} disabled={setsPage === 1}>
                Previous
              </Button>
              <span>Page {setsPage}</span>
              <Button variant="secondary" onClick={handleSetsNextPage} disabled={setsPage * 20 >= setsTotalCount}>
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {!selectedSet && globalSearch && (
        <>
          {sets.length > 0 && (
            <>
              <h3 className="search-section-heading">Sets</h3>
              <div className="cards-grid">
                {sets.map(set => (
                  <Set key={set.id} set={set} onClick={handleSetClick} />
                ))}
              </div>
            </>
          )}
          <h3 className="search-section-heading">Cards</h3>
          <div className="cards-grid">
            {cards.map(card => (
              <Card
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
            <Card
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
          <Button variant="secondary" onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </Button>
          <span>Page {page}</span>
          <Button variant="secondary" onClick={handleNextPage} disabled={page * 20 >= totalCount}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

// getting the partial set name + card from a compound search string.
// change the words into lowercase, trim whitespace and split them into parts
//  to match prefixes of the set and pokemon names
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