function Set({ set, onClick }) {
  return (
    <button type="button" className="set" onClick={() => onClick(set)}>
      <div className="set-image">
        <img src={set.images?.logo} alt={set.name} />
      </div>
      <div className="set-body">
        <p>{set.name}</p>
        <small>{set.series}</small>
        <small>{set.total} cards</small>
      </div>
    </button>
  )
}

export default Set