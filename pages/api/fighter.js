export default async function handler(req, res) {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Missing name query' });

    const API_BASE = 'https://api.octagon-api.com';

    // Fetch fighters list
    const fightersRes = await fetch(`${API_BASE}/fighters`);
    if (!fightersRes.ok) return res.status(502).json({ error: 'Failed to fetch fighters list' });
    const json = await fightersRes.json();

    // Fix here — get array from data property if exists
    const fighters = json.data || json;

    const q = name.trim().toLowerCase();
    // Build searchable names
    const candidates = fighters.map((f) => ({
      ...f,
      full: ((f.first_name || '') + ' ' + (f.last_name || '')).trim(),
      slug: f.slug || f.id
    }));

    let match = candidates.find((c) => (c.full || '').toLowerCase() === q);
    if (!match) match = candidates.find((c) => (c.full || '').toLowerCase().includes(q));
    if (!match) {
      match = candidates.find((
