import '../styles/forms.css'

function SearchBar({ query, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Search cards (e.g. Charizard)"
        value={query}
        onChange={e => onChange(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default SearchBar
