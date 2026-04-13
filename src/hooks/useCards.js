import { useState, useEffect, useCallback } from 'react'
import { searchCards } from '../api/cardsApi'

export function useCards() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (q = '') => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchCards(q)
      setCards(data)
    } catch (err) {
      setError(`Failed to load cards. ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { search('') }, [search])

  return { cards, loading, error, search }
}
