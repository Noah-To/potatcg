import { BACKEND } from './config'

export async function getCollection(username) {
  const res = await fetch(`${BACKEND}/collection/${username}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export async function addCard(username, card) {
  const payload = {
    id: card.id,
    name: card.name,
    image: card.image ?? card.images?.small,
    set_name: card.set_name ?? card.set?.name ?? '',
  }

  const res = await fetch(`${BACKEND}/collection/${username}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export async function removeCard(username, cardId) {
  const res = await fetch(`${BACKEND}/collection/${username}/${cardId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}