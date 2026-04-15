import { useState, useCallback, useRef } from 'react'
import { searchSets } from '../api/setsApi'

export function useSets() {
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const latestRequestRef = useRef(0)

  const search = useCallback(async (q = '') => {
    const trimmed = q.trim()
    const requestId = ++latestRequestRef.current

    setLoading(true)
    setError(null)

    try {
      const data = await searchSets(trimmed)
      if (requestId === latestRequestRef.current) {
        setSets(data)
      }
    } catch (err) {
      if (requestId === latestRequestRef.current) {
        setError(`Failed to load sets. ${err.message}`)
      }
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoading(false)
      }
    }
  }, [])

  return { sets, loading, error, search }
}