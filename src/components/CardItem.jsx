import Button from './ActionButton'
import '../styles/cards.css'

function Card({ card, onAction, actionLabel }) {
  return (
    <div className="card">
      <img src={card.images.small} alt={card.name} />
      <p>{card.name}</p>
      <small>{card.set?.name}</small>
      <Button variant="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  )
}

export default Card
