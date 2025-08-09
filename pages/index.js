import { useState, useMemo } from 'react';
import axios from 'axios';
import { Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend
);

export default function Home() {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [f1, setF1] = useState(null);
  const [f2, setF2] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchAndSet(name, setter) {
    if (!name) return alert('Enter a fighter name');
    setLoading(true);
    try {
      const res = await axios.get('/api/fighter?name=' + encodeURIComponent(name));
      setter(res.data);
    } catch (err) {
      console.error(err);
      alert(
        err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : 'Error fetching fighter'
      );
    } finally {
      setLoading(false);
    }
  }

  const radarData = useMemo(() => {
    if (!f1 || !f2) return null;
    const labels = ['Striking', 'Grappling', 'Stamina', 'Defense', 'Power'];
    const d1 = [
      Number(f1.stats?.striking || 0),
      Number(f1.stats?.grappling || 0),
      Number(f1.stats?.stamina || 0),
      Number(f1.stats?.defense || 0),
      Number(f1.stats?.power || 0)
    ];
    const d2 = [
      Number(f2.stats?.striking || 0),
      Number(f2.stats?.grappling || 0),
      Number(f2.stats?.stamina || 0),
      Number(f2.stats?.defense || 0),
      Number(f2.stats?.power || 0)
    ];
    return {
      labels,
      datasets: [
        {
          label: f1.first_name + ' ' + f1.last_name,
          data: d1,
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1
        },
        {
          label: f2.first_name + ' ' + f2.last_name,
          data: d2,
          backgroundColor: 'rgba(54,162,235,0.2)',
          borderColor: 'rgba(54,162,235,1)',
          borderWidth: 1
        }
      ]
    };
  }, [f1, f2]);

  const barData = useMemo(() => {
    if (!f1 || !f2) return null;
    const labels = ['Height (in)', 'Reach (in)', 'Win %'];
    const h1 = Number((f1.height || '').toString().replace(/[^0-9.]/g, '') || 0);
    const h2 = Number((f2.height || '').toString().replace(/[^0-9.]/g, '') || 0);
    const r1 = Number((f1.reach || '').toString().replace(/[^0-9.]/g, '') || 0);
    const r2 = Number((f2.reach || '').toString().replace(/[^0-9.]/g, '') || 0);
    const wp1 =
      f1.wins && f1.wins + (f1.losses || 0) > 0 ? Math.round((100 * f1.wins) / (f1.wins + (f1.losses || 0))) : 0;
    const wp2 =
      f2.wins && f2.wins + (f2.losses || 0) > 0 ? Math.round((100 * f2.wins) / (f2.wins + (f2.losses || 0))) : 0;
    return {
      labels,
      datasets: [
        { label: f1.first_name + ' ' + f1.last_name, data: [h1, r1, wp1], backgroundColor: 'rgba(255,99,132,0.5)' },
        { label: f2.first_name + ' ' + f2.last_name, data: [h2, r2, wp2], backgroundColor: 'rgba(54,162,235,0.5)' }
      ]
    };
  }, [f1, f2]);

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', padding: '0 16px' }}>
      <h1>UFC Fighter Stats — Real-time</h1>
      <p style={{ color: '#666' }}>
        Search fighters by name (live data from Octagon API). Compare two fighters side-by-side with charts.
      </p>

      <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
        <div style={{ flex: 1 }}>
          <input
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
            placeholder="Fighter 1 name"
            style={{ width: '100%', padding: 10 }}
          />
          <button onClick={() => fetchAndSet(q1, setF1)} disabled={loading} style={{ marginTop: 8 }}>
            Load Fighter 1
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <input
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
            placeholder="Fighter 2 name"
            style={{ width: '100%', padding: 10 }}
          />
          <button onClick={() => fetchAndSet(q2, setF2)} disabled={loading} style={{ marginTop: 8 }}>
            Load Fighter 2
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        {f1 && (
          <div style={{ flex: 1, background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
            <h3>
              {f1.first_name} {f1.last_name} {f1.nickname ? `"${f1.nickname}"` : ''}
            </h3>
            <p>
              Record: {f1.wins || 0}-{f1.losses || 0}-{f1.draws || 0} | Weight: {f1.weight_class || f1.division}
            </p>
            <table>
              <tbody>
                <tr>
                  <td style={{ color: '#666' }}>Height</td>
                  <td style={{ paddingLeft: 8 }}>{f1.height}</td>
                </tr>
                <tr>
                  <td style={{ color: '#666' }}>Reach</td>
                  <td style={{ paddingLeft: 8 }}>{f1.reach}</td>
                </tr>
                <tr>
                  <td style={{ color: '#666' }}>Stance</td>
                  <td style={{ paddingLeft: 8 }}>{f1.stance}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {f2 && (
          <div style={{ flex: 1, background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
            <h3>
              {f2.first_name} {f2.last_name} {f2.nickname ? `"${f2.nickname}"` : ''}
            </h3>
            <p>
              Record: {f2.wins || 0}-{f2.losses || 0}-{f2.draws || 0} | Weight: {f2.weight_class || f2.division}
            </p>
            <table>
              <tbody>
                <tr>
                  <td style={{ color: '#666' }}>Height</td>
                  <td style={{ paddingLeft: 8 }}>{f2.height}</td>
                </tr>
                <tr>
                  <td style={{ color: '#666' }}>Reach</td>
                  <td style={{ paddingLeft: 8 }}>{f2.reach}</td>
                </tr>
                <tr>
                  <td style={{ color: '#666' }}>Stance</td>
                  <td style={{ paddingLeft: 8 }}>{f2.stance}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {radarData && (
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
            <h4>Skill Radar</h4>
            <Radar data={radarData} />
          </div>
          <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
            <h4>Physical & Win %</h4>
            <Bar data={barData} />
          </div>
        </div>
      )}
    </div>
  );
}
