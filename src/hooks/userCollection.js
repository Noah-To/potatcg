import { useState, useEffect, useRef } from 'react'
import { getCollection, addCard, removeCard } from '../api/collectionApi'

export function userCollection(username) {
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
   
      .catch((error) => {
        console.error('Failed to load collection:', error)
        setError('Could not load your collection.')
      })
      .finally(() => setLoading(false))
  }, [username])

  // prevent multiple simultaneous add or remove operations
  // by using a reference track to see if there is already a request in progess
  const add = async (card) => {
    if (busy.current) return
    busy.current = true
    try {
      const updated = await addCard(username, card)
      setCards(updated)
    } catch (error) {
      console.error('Add failed:', error)
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
    } catch (error) {
      console.error('Remove failed:', error)
      setError('Failed to remove card. Please try again.')
    } finally {
      busy.current = false
    }
  }

  return { cards, loading, error, add, remove }
}
