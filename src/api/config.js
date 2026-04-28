export const BACKEND = 'http://localhost:3001'

const cache = new Map()

export async function fetchWithCache(key, url) {
  if (cache.has(key)) return cache.get(key)

// cancel request if it takes a minute to respond, catches this by throwing error
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)

  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    const data = await res.json()
    cache.set(key, data)
    return data
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timed out')
    throw err
  } finally {
    clearTimeout(timeout)
  }
}
