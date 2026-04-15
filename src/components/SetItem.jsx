function SetItem({ set, onClick }) {
  return (
    <button type="button" className="set-card" onClick={() => onClick(set)}>
      <div className="set-card-image">
        <img src={set.images?.logo} alt={set.name} />
      </div>
      <div className="set-card-body">
        <p>{set.name}</p>
        <small>{set.series}</small>
        <small>{set.total} cards</small>
      </div>
    </button>
  )
}

export default SetItem