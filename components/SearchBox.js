import { useState, useEffect, useRef } from 'react';

export default function SearchBox({ onSelect, placeholder = 'Search fighter...' }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/fighter?search=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('API error');
        const json = await res.json();
        setResults(json);
        setShowDropdown(json.length > 0);
      } catch {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  function handleSelect(fighter) {
    setQuery(fighter.name);
    setShowDropdown(false);
    onSelect(fighter);
  }

  return (
    <div style={{ position: 'relative', width: 300 }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '8px', fontSize: '16px' }}
        autoComplete="off"
      />
      {showDropdown && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: 200,
            overflowY: 'auto',
            border: '1px solid #ccc',
            background: 'white',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            zIndex: 1000,
            cursor: 'pointer',
          }}
        >
          {results.map(fighter => (
            <li
              key={fighter.id}
              onClick={() => handleSelect(fighter)}
              style={{ padding: '8px', borderBottom: '1px solid #eee' }}
            >
              {fighter.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
