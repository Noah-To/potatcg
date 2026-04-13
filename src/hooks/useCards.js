import { useState, useCallback, useRef } from 'react'
import { searchCards } from '../api/cardsApi'

export function useCards() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const latestRequestRef = useRef(0)

  const search = useCallback(async (q = '') => {
    const trimmed = q.trim()

    if (!trimmed) {
      setCards([])
      setError(null)
      setLoading(false)
      return
    }

    const requestId = ++latestRequestRef.current
    setLoading(true)
    setError(null)

    try {
      const data = await searchCards(trimmed)

      if (requestId === latestRequestRef.current) {
        setCards(data)
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

  return { cards, loading, error, search }
}