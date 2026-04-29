import { BACKEND, cacheFetch } from './config'

export async function searchSets(q = '', page = 1) {
  const trimmedQ = q.trim()
  const key = `sets:${trimmedQ.toLowerCase()}:${page}`

  let url = `${BACKEND}/sets?pageSize=20&page=${page}`
  if (trimmedQ) url += `&q=${encodeURIComponent(trimmedQ)}`

  const data = await cacheFetch(key, url)
  return { sets: data.data, totalCount: data.totalCount }
}