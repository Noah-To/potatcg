const BACKEND = 'http://localhost:3001'

// Module-level cache — persists while the browser tab is open
const cache = new Map()

export async function searchCards(q = '') {
  const key = q.toLowerCase()
  if (cache.has(key)) return cache.get(key)

  let url = `${BACKEND}/cards?pageSize=20`
  if (q) url += `&q=${encodeURIComponent(q)}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  cache.set(key, data.data)
  return data.data
}
