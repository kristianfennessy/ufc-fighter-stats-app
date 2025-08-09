import { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [fighterData, setFighterData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selected) {
      setFighterData(null);
      setError('');
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(`/api/fighter?id=${selected.id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch');
        setFighterData(json);
        setError('');
      } catch (e) {
        setError(e.message);
        setFighterData(null);
      }
    }

    fetchData();
  }, [selected]);

  return (
    <div style={{ padding: 20 }}>
      <h1>UFC Fighter Stats</h1>
      <SearchBox onSelect={setSelected} placeholder="Search fighter by name..." />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fighterData && (
        <div style={{ marginTop: 20 }}>
          <h2>{fighterData.name}</h2>
          <p><b>Height:</b> {fighterData.height}</p>
          <p><b>Reach:</b> {fighterData.reach}</p>
          <p><b>Stance:</b> {fighterData.stance}</p>
          <p><b>Weight Class:</b> {fighterData.weight_class}</p>
          <p><b>DOB:</b> {fighterData.dob}</p>
          <p><b>Wins:</b> {fighterData.wins}</p>
          <p><b>Losses:</b> {fighterData.losses}</p>
          <p><b>Draws:</b> {fighterData.draws}</p>
          <a href={fighterData.url} target="_blank" rel="noreferrer">UFCStats Profile</a>
        </div>
      )}
    </div>
  );
}
