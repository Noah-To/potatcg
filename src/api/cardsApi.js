const BACKEND = 'http://localhost:3001'

const cache = new Map()

export async function searchCards(q = '', setId = '', page = 1) {
  const trimmedQ = q.trim()
  const trimmedSetId = setId.trim()
  const key = `cards:${trimmedQ.toLowerCase()}:${trimmedSetId.toLowerCase()}`

  if (cache.has(key)) return cache.get(key)

  let url = `${BACKEND}/cards?pageSize=20&page=${page}`

  if (trimmedQ) url += `&q=${encodeURIComponent(trimmedQ)}`
  if (trimmedSetId) url += `&setId=${encodeURIComponent(trimmedSetId)}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(url, { signal: controller.signal })

    if (!res.ok) throw new Error(`API error ${res.status}`)

    const data = await res.json()
    cache.set(key, data.data)
    return data.data
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }
}