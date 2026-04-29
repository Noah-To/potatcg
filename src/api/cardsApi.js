import { BACKEND, cacheFetch } from './config'

export async function searchCards(q = '', setId = '', page = 1) {
  const trimmedQ = q.trim()
  const trimmedSetId = setId.trim()
  const key = `cards:${trimmedQ.toLowerCase()}:${trimmedSetId.toLowerCase()}:${page}`

  let url = `${BACKEND}/cards?pageSize=20&page=${page}`
  if (trimmedQ) url += `&q=${encodeURIComponent(trimmedQ)}`
  if (trimmedSetId) url += `&setId=${encodeURIComponent(trimmedSetId)}`

  const data = await cacheFetch(key, url)
  return { cards: data.data ?? [], totalCount: data.totalCount ?? 0 }
}