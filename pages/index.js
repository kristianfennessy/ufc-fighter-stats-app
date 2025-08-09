import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [fighterName, setFighterName] = useState('');
  const [fighterData, setFighterData] = useState(null);
  const [error, setError] = useState('');

  async function fetchFighter() {
    setError('');
    setFighterData(null);
    if (!fighterName) return;

    try {
      const res = await fetch(`/api/fighter?name=${encodeURIComponent(fighterName)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Unknown error');
      setFighterData(json);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>UFC Fighter Stats</h1>
      <input
        placeholder="Enter fighter name"
        value={fighterName}
        onChange={(e) => setFighterName(e.target.value)}
        style={{ width: 300, marginRight: 10 }}
      />
      <button onClick={fetchFighter}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fighterData && (
        <div style={{ marginTop: 20 }}>
          <h2>{fighterName}</h2>
          <p><b>Height:</b> {fighterData.height}</p>
          <p><b>Reach:</b> {fighterData.reach}</p>
          <p><b>Stance:</b> {fighterData.stance}</p>
          <p><b>Weight Class:</b> {fighterData.weight_class}</p>
          <p><b>Date of Birth:</b> {fighterData.dob}</p>
          <p><b>Wins:</b> {fighterData.wins}</p>
          <p><b>Losses:</b> {fighterData.losses}</p>
          <p><b>Draws:</b> {fighterData.draws}</p>
          <a href={fighterData.url} target="_blank" rel="noreferrer">
            Full UFCStats Profile
          </a>

          <div style={{ marginTop: 20 }}>
            <Link href={`/compare?fighter1=${encodeURIComponent(fighterName)}`}>
              <a>Compare this fighter</a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
