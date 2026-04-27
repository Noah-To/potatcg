import { BACKEND, fetchWithCache } from './config'

export async function searchSets(q = '') {
  const trimmedQ = q.trim()
  const key = `sets:${trimmedQ.toLowerCase()}`

  let url = `${BACKEND}/sets?pageSize=50`
  if (trimmedQ) url += `&q=${encodeURIComponent(trimmedQ)}`

  const data = await fetchWithCache(key, url)
  return data.data
}