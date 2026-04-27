import '../styles/forms.css'
import SearchHelp from './SearchHelp'

function SearchBar({ query, onChange, onSubmit, loading }) {
  return (
    <div className="search-bar-wrapper">
      <SearchHelp />
      <form onSubmit={onSubmit} className="search-bar">
        <input
          type="text"
          placeholder="Search by card name, card ID, or set name…"
          value={query}
          onChange={e => onChange(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  )
}

export default SearchBar
