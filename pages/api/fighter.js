import fetch from 'node-fetch'

const API_BASE = process.env.OCTAGON_API_BASE || 'https://api.octagon-api.com'

// Simple helper: fetch fighters list, find closest match by name, then fetch fighter details.
export default async function handler(req, res) {
  try {
    const { name } = req.query
    if (!name) return res.status(400).json({ error: 'Missing name query' })

    // fetch fighters list
    const fightersRes = await fetch(`${API_BASE}/fighters`)
    if (!fightersRes.ok) return res.status(502).json({ error: 'Failed to fetch fighters list' })
    const fighters = await fightersRes.json()

    const q = name.trim().toLowerCase()
    // build searchable names
    const candidates = fighters.map(f => ({ ...f, full: ((f.first_name||'') + ' ' + (f.last_name||'')).trim(), slug: f.slug || f.id }))
    // try exact or includes
    let match = candidates.find(c => (c.full || '').toLowerCase() === q)
    if (!match) match = candidates.find(c => (c.full || '').toLowerCase().includes(q))
    if (!match) {
      // try nickname
      match = candidates.find(c => (c.nickname||'').toLowerCase().includes(q))
    }
    if (!match) return res.status(404).json({ error: 'Fighter not found' })

    // fetch fighter details
    const detailRes = await fetch(`${API_BASE}/fighter/${encodeURIComponent(match.slug)}`)
    if (!detailRes.ok) return res.status(502).json({ error: 'Failed to fetch fighter details' })
    const detail = await detailRes.json()

    return res.status(200).json(detail)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message || 'server error' })
  }
}
