import { useAuth } from '../hooks/useAuth'
import { useCollection } from '../hooks/useCollection'
import LoadingState from '../components/LoadingState'
import ErrorMessage from '../components/ErrorMessage'
import ActionButton from '../components/ActionButton'
import '../styles/cards.css'

function CollectionPage() {
  const { user } = useAuth()
  const { cards, loading, error, add, remove } = useCollection(user)
  const totalCards = cards.reduce((sum, card) => sum + (card.quantity ?? 1), 0)

  if (loading) return <LoadingState />

  return (
    <>
      <ErrorMessage message={error} />
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
            <ActionButton variant="primary" onClick={() => add(card)}>+1</ActionButton>
            <ActionButton variant="danger" onClick={() => remove(card.id)}>-1</ActionButton>
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
