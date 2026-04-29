import { useState, useCallback, useRef } from 'react'
import { searchCards } from '../api/cardsApi'

// similar logic to useSets in terms of fetching data and checking 
// if there is an exisiting request
export function userCards() {
  const [cards, setCards] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const lastRequestRef = useRef(0)

  const search = useCallback(async (q = '', setId = '', page = 1) => {
    const requestId = ++lastRequestRef.current

    setLoading(true)
    setError(null)

    // cancel ongoing request if a new search is there. checking if the requested ID matches the most reccent one
    try {
      const data = await searchCards(q, setId, page)
      if (requestId === lastRequestRef.current) {
        setCards(data.cards)
        setTotalCount(data.totalCount)
      }
    } catch (error) {
      if (requestId === lastRequestRef.current) {
        setError(`Failed to load cards. ${error.message}`)
      }
    } finally {
      if (requestId === lastRequestRef.current) {
        setLoading(false)
      }
    }
  }, [])

  return { cards, totalCount, loading, error, search }
}
