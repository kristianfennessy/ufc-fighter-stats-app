import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

const statLabels = ['Wins', 'Losses', 'Draws'];

export default function Compare() {
  const router = useRouter();
  const { fighter1: initialFighter1 = '', fighter2: initialFighter2 = '' } = router.query;

  const [fighter1, setFighter1] = useState(initialFighter1);
  const [fighter2, setFighter2] = useState(initialFighter2);
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialFighter1) setFighter1(initialFighter1);
    if (initialFighter2) setFighter2(initialFighter2);
  }, [initialFighter1, initialFighter2]);

  async function fetchFighter(name, setData) {
    if (!name) return setData(null);
    try {
      const res = await fetch(`/api/fighter?name=${encodeURIComponent(name)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Unknown error');
      setData(json);
      setError('');
    } catch (e) {
      setData(null);
      setError(e.message);
    }
  }

  useEffect(() => {
    fetchFighter(fighter1, setData1);
  }, [fighter1]);

  useEffect(() => {
    fetchFighter(fighter2, setData2);
  }, [fighter2]);

  const chartData = {
    labels: statLabels,
    datasets: [
      {
        label: fighter1 || 'Fighter 1',
        data: data1 ? [data1.wins || 0, data1.losses || 0, data1.draws || 0] : [],
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
      {
        label: fighter2 || 'Fighter 2',
        data: data2 ? [data2.wins || 0, data2.losses || 0, data2.draws || 0] : [],
        backgroundColor: 'rgba(54, 162, 235, 0.4)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Compare UFC Fighters</h1>

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Fighter 1"
          value={fighter1}
          onChange={(e) => setFighter1(e.target.value)}
          style={{ marginRight: 10, width: 200 }}
        />
        <input
          placeholder="Fighter 2"
          value={fighter2}
          onChange={(e) => setFighter2(e.target.value)}
          style={{ width: 200 }}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data1 && data2 ? (
        <div>
          <Radar data={chartData} />

          <div style={{ display: 'flex', marginTop: 20 }}>
            <div style={{ marginRight: 50 }}>
              <h3>{fighter1}</h3>
              <p><b>Height:</b> {data1.height}</p>
              <p><b>Reach:</b> {data1.reach}</p>
              <p><b>Stance:</b> {data1.stance}</p>
              <p><b>Weight Class:</b> {data1.weight_class}</p>
              <p><b>Date of Birth:</b> {data1.dob}</p>
              <p><b>Wins:</b> {data1.wins}</p>
              <p><b>Losses:</b> {data1.losses}</p>
              <p><b>Draws:</b> {data1.draws}</p>
              <a href={data1.url} target="_blank" rel="noreferrer">UFCStats Profile</a>
            </div>

            <div>
              <h3>{fighter2}</h3>
              <p><b>Height:</b> {data2.height}</p>
              <p><b>Reach:</b> {data2.reach}</p>
              <p><b>Stance:</b> {data2.stance}</p>
              <p><b>Weight Class:</b> {data2.weight_class}</p>
              <p><b>Date of Birth:</b> {data2.dob}</p>
              <p><b>Wins:</b> {data2.wins}</p>
              <p><b>Losses:</b> {data2.losses}</p>
              <p><b>Draws:</b> {data2.draws}</p>
              <a href={data2.url} target="_blank" rel="noreferrer">UFCStats Profile</a>
            </div>
          </div>
        </div>
      ) : (
        <p>Enter two fighters to compare</p>
      )}
    </div>
  );
}
