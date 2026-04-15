const BACKEND = 'http://localhost:3001'

const cache = new Map()

export async function searchSets(q = '') {
  const trimmedQ = q.trim()
  const key = `sets:${trimmedQ.toLowerCase()}`

  if (cache.has(key)) return cache.get(key)

  let url = `${BACKEND}/sets?pageSize=50`
  if (trimmedQ) url += `&q=${encodeURIComponent(trimmedQ)}`

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