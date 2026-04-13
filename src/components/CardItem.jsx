import '../styles/cards.css'

function CardItem({ card, onAction, actionLabel }) {
  return (
    <div className="card-item">
      <img src={card.images.small} alt={card.name} />
      <p>{card.name}</p>
      <small>{card.set?.name}</small>
      <button className="action-btn" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}

export default CardItem
