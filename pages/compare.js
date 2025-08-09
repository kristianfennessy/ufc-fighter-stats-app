import { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function Compare() {
  const [fighter1, setFighter1] = useState(null);
  const [fighter2, setFighter2] = useState(null);
  const [stats1, setStats1] = useState(null);
  const [stats2, setStats2] = useState(null);

  async function fetchStats(fighter) {
    if (!fighter) return null;
    try {
      const res = await fetch(`/api/fighter-stats?url=${encodeURIComponent(fighter.url)}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      return data;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    fetchStats(fighter1).then(setStats1);
  }, [fighter1]);

  useEffect(() => {
    fetchStats(fighter2).then(setStats2);
  }, [fighter2]);

  const labels = ['Striking', 'Grappling', 'Defense', 'Takedown', 'Control'];

  const data = {
    labels,
    datasets: [
      {
        label: fighter1?.name || 'Fighter 1',
        data: stats1 ? labels.map((l) => stats1[l.toLowerCase()] || 0) : [],
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: fighter2?.name || 'Fighter 2',
        data: stats2 ? labels.map((l) => stats2[l.toLowerCase()] || 0) : [],
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h1>Compare UFC Fighters</h1>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <SearchBox onSelect={setFighter1} placeholder="Search Fighter 1" />
        <SearchBox onSelect={setFighter2} placeholder="Search Fighter 2" />
      </div>
      {(stats1 || stats2) && <Radar data={data} />}
    </div>
  );
}
