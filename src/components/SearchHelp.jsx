import { useState } from 'react'
import '../styles/searchhelp.css'

const PAGES = [
  {
    title: 'Search by Pokémon name',
    tip: 'Type the name of the Pokémon, does not have to be full names!',
    examplesLabel: 'Examples',
    examples: [
      'Charizard',
      'Pika  →  Pikachu, Pikachu VMAX…',
      'Eevee V',
    ],
  },
  {
    title: 'Search by set name',
    tip: "Type part of the set name to find the set!",
    examplesLabel: 'Examples',
    examples: ['Base Set', 'Jungle', 'Sword', '151'],
  },
  {
    title: 'Search set + pokémon together',
    tip: 'Type part of the set name and part of the Pokémon name — order does not matter!',
    examplesLabel: 'Examples',
    examples: [
      'phantasmal cha  →  Charizard in Phantasmal Flames',
      'Base Set Char  →  Charizard in Base Set',
      'Char Base Set  →  same result',
    ],
    note: 'If nothing shows up, check your spelling!'
  },
]

export default function SearchHint() {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)

  const current = PAGES[page]

  return (
    <div className="search-hint">
      <button
        type="button"
        className={`search-hint-btn${open ? ' active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close search help' : 'Search help'}
      >
        ?
      </button>

      {open && (
        <div className="search-hint-bubble" role="dialog" aria-label="Search tips">
          <p className="search-hint-title">{current.title}</p>
          <p className="search-hint-tip">{current.tip}</p>
          <p className="search-hint-examples-label">{current.examplesLabel}</p>
          <ul className="search-hint-examples">
            {current.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
          {current.note && (
            <p className="search-hint-note">{current.note}</p>
          )}
          <div className="search-hint-nav">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              ‹ Prev
            </button>
            <span>{page + 1} / {PAGES.length}</span>
            <button
              type="button"
              disabled={page === PAGES.length - 1}
              onClick={() => setPage(p => p + 1)}
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
