import { useState, useEffect } from 'react'
import { getCollection, removeCard } from '../api/collectionApi'

export function useCollection(username) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollection(username)
      .then(setCards)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [username])

  const remove = async (cardId) => {
    const updated = await removeCard(username, cardId)
    setCards(updated)
  }

  return { cards, loading, remove }
}
