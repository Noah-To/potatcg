import ActionButton from './ActionButton'
import '../styles/cards.css'

function CardItem({ card, onAction, actionLabel }) {
  return (
    <div className="card-item">
      <img src={card.images.small} alt={card.name} />
      <p>{card.name}</p>
      <small>{card.set?.name}</small>
      <ActionButton variant="primary" onClick={onAction}>
        {actionLabel}
      </ActionButton>
    </div>
  )
}

export default CardItem
