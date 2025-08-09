import { useState, useEffect, useRef } from 'react';

export default function SearchBox({ onSelect, placeholder }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef();

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/fighter?search=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        setResults(data);
        setShowDropdown(data.length > 0);
      } catch {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  function selectResult(fighter) {
    setQuery(fighter.name);
    setShowDropdown(false);
    onSelect(fighter);
  }

  return (
    <div style={{ position: 'relative', width: 300 }}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: '100%', padding: 8, fontSize: 16 }}
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
            backgroundColor: 'white',
            border: '1px solid #ccc',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          {results.map((fighter) => (
            <li
              key={fighter.url}
              onClick={() => selectResult(fighter)}
              style={{ padding: 8, borderBottom: '1px solid #eee' }}
            >
              {fighter.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
