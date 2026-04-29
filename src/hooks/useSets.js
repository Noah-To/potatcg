import { useState, useCallback, useRef } from 'react'
import { searchSets } from '../api/setsApi'

// similar logic to useCards in terms of fetching data and checking 
// if there is an exisiting request 
export function useSets() {
  const [sets, setSets] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const lastRequestRef = useRef(0)

  const search = useCallback(async (q = '', page = 1) => {
    const requestId = ++lastRequestRef.current

    setLoading(true)
    setError(null)

    try {
      const data = await searchSets(q, page)
      if (requestId === lastRequestRef.current) {
        setSets(data.sets)
        setTotalCount(data.totalCount)
      }
    } catch (error) {
      if (requestId === lastRequestRef.current) {
        setError(`Failed to load sets. ${error.message}`)
      }
    } finally {
      if (requestId === lastRequestRef.current) {
        setLoading(false)
      }
    }
  }, [])

  return { sets, totalCount, loading, error, search }
}