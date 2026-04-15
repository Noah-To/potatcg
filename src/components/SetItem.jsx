function SetItem({ set, onClick }) {
  return (
    <button className="set-card" onClick={() => onClick(set)} type="button">
      <div className="set-card-image">
        <img src={set.images?.logo} alt={set.name} />
      </div>
      <div className="set-card-body">
        <h3>{set.name}</h3>
        <p>{set.series}</p>
        <p>{set.total} cards</p>
      </div>
    </button>
  )
}

export default SetItem