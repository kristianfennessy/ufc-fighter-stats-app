import { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const statLabels = ['Wins', 'Losses', 'Draws'];

export default function Compare() {
  const [fighter1, setFighter1] = useState(null);
  const [fighter2, setFighter2] = useState(null);
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!fighter1) {
      setData1(null);
      return;
    }
    async function fetchData() {
      try {
        const res = await fetch(`/api/fighter?id=${fighter1.id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch fighter 1');
        setData1(json);
        setError('');
      } catch (e) {
        setError(e.message);
        setData1(null);
      }
    }
    fetchData();
  }, [fighter1]);

  useEffect(() => {
    if (!fighter2) {
      setData2(null);
      return;
    }
    async function fetchData() {
      try {
        const res = await fetch(`/api/fighter?id=${fighter2.id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to fetch fighter 2');
        setData2(json);
        setError('');
      } catch (e) {
        setError(e.message);
        setData2(null);
      }
    }
    fetchData();
  }, [fighter2]);

  const chartData = {
    labels: statLabels,
    datasets: [
      {
        label: fighter1?.name || 'Fighter 1',
        data: data1 ? [data1.wins || 0, data1.losses || 0, data1.draws || 0] : [],
        backgroundColor: 'rgba(255, 99, 132, 0.4)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
      {
        label: fighter2?.name || 'Fighter 2',
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
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <SearchBox onSelect={setFighter1} placeholder="Search Fighter 1" />
        <SearchBox onSelect={setFighter2} placeholder="Search Fighter 2" />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data1 && data2 ? (
        <>
          <Radar data={chartData} style={{ maxWidth: 500, marginTop: 30 }} />

          <div style={{ display: 'flex', marginTop: 20, gap: 50, flexWrap: 'wrap' }}>
            <div>
              <h3>{fighter1.name}</h3>
              <p><b>Height:</b> {data1.height}</p>
              <p><b>Reach:</b> {data1.reach}</p>
              <p><b>Stance:</b> {data1.stance}</p>
              <p><b>Weight Class:</b> {data1.weight_class}</p>
              <p><b>DOB:</b> {data1.dob}</p>
              <p><b>Wins:</b> {data1.wins}</p>
              <p><b>Losses:</b> {data1.losses}</p>
              <p><b>Draws:</b> {data1.draws}</p>
              <a href={data1.url} target="_blank" rel="noreferrer">UFCStats Profile</a>
            </div>
            <div>
              <h3>{fighter2.name}</h3>
              <p><b>Height:</b> {data2.height}</p>
              <p><b>Reach:</b> {data2.reach}</p>
              <p><b>Stance:</b> {data2.stance}</p>
              <p><b>Weight Class:</b> {data2.weight_class}</p>
              <p><b>DOB:</b> {data2.dob}</p>
              <p><b>Wins:</b> {data2.wins}</p>
              <p><b>Losses:</b> {data2.losses}</p>
              <p><b>Draws:</b> {data2.draws}</p>
              <a href={data2.url} target="_blank" rel="noreferrer">UFCStats Profile</a>
            </div>
          </div>
        </>
      ) : (
        <p style={{ marginTop: 20 }}>Select two fighters to compare.</p>
      )}
    </div>
  );
}
