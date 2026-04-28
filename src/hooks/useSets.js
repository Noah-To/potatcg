import { useState, useCallback, useRef } from 'react'
import { searchSets } from '../api/setsApi'

// similar logic to useCards in terms of fetching data and checking 
// if there is an exisiting request 
export function useSets() {
  const [sets, setSets] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const latestRequestRef = useRef(0)

  const search = useCallback(async (q = '', page = 1) => {
    const requestId = ++latestRequestRef.current

    setLoading(true)
    setError(null)

    try {
      const data = await searchSets(q, page)
      if (requestId === latestRequestRef.current) {
        setSets(data.sets)
        setTotalCount(data.totalCount)
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

  return { sets, totalCount, loading, error, search }
}