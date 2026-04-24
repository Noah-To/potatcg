import { useState, useEffect, useRef } from 'react'
import { getCollection, addCard, removeCard } from '../api/collectionApi'

export function useCollection(username) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const busy = useRef(false)

  useEffect(() => {
    if (!username) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    getCollection(username)
      .then(setCards)
   
      .catch((err) => {
        console.error('Failed to load collection:', err)
        setError('Could not load your collection.')
      })
      .finally(() => setLoading(false))
  }, [username])

  const add = async (card) => {
    if (busy.current) return
    busy.current = true
    try {
      const updated = await addCard(username, card)
      setCards(updated)
    } catch (err) {
      console.error('Add failed:', err)
      setError('Failed to add card. Please try again.')
    } finally {
      busy.current = false
    }
  }

  const remove = async (cardId) => {
    if (busy.current) return
    busy.current = true
    try {
      const updated = await removeCard(username, cardId)
      setCards(updated)
    } catch (err) {
      console.error('Remove failed:', err)
      setError('Failed to remove card. Please try again.')
    } finally {
      busy.current = false
    }
  }

  return { cards, loading, error, add, remove }
}
