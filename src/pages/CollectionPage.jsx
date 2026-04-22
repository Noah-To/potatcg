import { useAuth } from '../hooks/useAuth'
import { useCollection } from '../hooks/useCollection'
import LoadingState from '../components/LoadingState'
import '../styles/cards.css'

function CollectionPage() {
  const { user } = useAuth()
  const { cards, loading, remove } = useCollection(user)

  if (loading) return <LoadingState />

  return (
    <div className="page">
      <h2>My Collection ({cards.length} cards)</h2>
      {cards.length === 0 ? (
        <p>No cards yet. Browse and add some!</p>
      ) : (
        <div className="cards-grid">
          {cards.map(card => (
            <div key={card.id} className="card-item">
              <img src={card.image} alt={card.name} />
              <p>{card.name}</p>
              <small>{card.set_name}</small>
              <small>Qty: {card.quantity ?? 1}</small>
              <button className="remove-btn" onClick={() => remove(card.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CollectionPage
