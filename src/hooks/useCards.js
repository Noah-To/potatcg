import { useState, useCallback, useRef } from 'react'
import { searchCards } from '../api/cardsApi'

export function useCards() {
  const [cards, setCards] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const latestRequestRef = useRef(0)

  const search = useCallback(async (q = '', setId = '', page = 1) => {
    const requestId = ++latestRequestRef.current

    setLoading(true)
    setError(null)

    try {
      const data = await searchCards(q, setId, page)
      if (requestId === latestRequestRef.current) {
        setCards(data.cards)
        setTotalCount(data.totalCount)
      }
    } catch (err) {
      if (requestId === latestRequestRef.current) {
        setError(`Failed to load cards. ${err.message}`)
      }
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoading(false)
      }
    }
  }, [])

  return { cards, totalCount, loading, error, search }
}