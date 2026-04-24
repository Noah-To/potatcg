import { useAuth } from '../hooks/useAuth'
import { useCollection } from '../hooks/useCollection'
import LoadingState from '../components/LoadingState'
import '../styles/cards.css'

function CollectionPage() {
  const { user } = useAuth()
  const { cards, loading, error, add, remove } = useCollection(user)
  const totalCards = cards.reduce((sum, card) => sum + (card.quantity ?? 1), 0)

  if (loading) return <LoadingState />

  return (
    <>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    <div className="page">
      <h2>My Collection ({totalCards} cards)</h2>
      {cards.length === 0 ? (
        <p>No cards yet. Browse and add some!</p>
      ) : (
        <div className="cards-grid">
          {cards.map(card => (
            <div key={card.id} className="card-item">
              <img src={card.image} alt={card.name} />
              <p>{card.name} <span className="qty-badge">x{card.quantity ?? 1}</span></p>
               <small>{card.set_name}</small>

          <div className="card-actions">
             <button className="action-btn" onClick={() => add(card)}> +1 </button>
             <button className="remove-btn" onClick={() => remove(card.id)}>-1</button>
          </div>
        </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}

export default CollectionPage
