import fetch from 'node-fetch';

let cachedFighters = null;
let cacheTimestamp = 0;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export default async function handler(req, res) {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Missing name query' });

    const now = Date.now();

    // Cache fighter list to avoid scraping each time
    if (!cachedFighters || now - cacheTimestamp > CACHE_TTL) {
      cachedFighters = await fetchFightersList();
      cacheTimestamp = now;
    }

    if (!cachedFighters) {
      return res.status(500).json({ error: 'Failed to load fighters list' });
    }

    const q = name.trim().toLowerCase();

    // Find fighter by full name or nickname
    const match = cachedFighters.find((f) => {
      const fullName = (f.firstName + ' ' + f.lastName).toLowerCase();
      return fullName === q || f.nickName.toLowerCase() === q || fullName.includes(q);
    });

    if (!match) return res.status(404).json({ error: 'Fighter not found' });

    // Fetch detailed fighter stats
    const details = await fetchFighterDetails(match.url);

    if (!details) return res.status(500).json({ error: 'Failed to load fighter details' });

    return res.status(200).json(details);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'server error' });
  }
}

async function fetchFightersList() {
  const fightersUrl = 'http://ufcstats.com/statistics/fighters?char=a&page=all';

  try {
    const response = await fetch(fightersUrl);
    if (!response.ok) throw new Error('Failed to fetch fighters list');

    const html = await response.text();

    const regex = /<tr class="b-statistics__table-row">([\s\S]*?)<\/tr>/g;

    const fighters = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      const row = match[1];

      const urlMatch = row.match(/<a href="(http:\/\/ufcstats.com\/fighter-details\/[^"]+)"/);
      const nameMatch = row.match(/<a[^>]*>([^<]+)<\/a>.*<td class="b-statistics__table-col">(.*?)<\/td>/s);
      const nickMatch = row.match(/<td class="b-statistics__table-col b-statistics__table-col_style_big">([^<]*)<\/td>/);

      if (!urlMatch || !nameMatch) continue;

      const fullName = nameMatch[1].trim();
      const [firstName, ...lastParts] = fullName.split(' ');
      const lastName = lastParts.join(' ');
      const nickName = nickMatch ? nickMatch[1].trim() : '';

      fighters.push({
        url: urlMatch[1],
        firstName,
        lastName,
        nickName,
      });
    }

    return fighters;
  } catch (e) {
    console.error('Error fetching fighters list:', e);
    return null;
  }
}

async function fetchFighterDetails(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch fighter details');

    const html = await res.text();

    const heightMatch = html.match(/Height:<\/i><\/span>\s*([^<]+)<\/li>/);
    const weightClassMatch = html.match(/Weight Class:<\/i><\/span>\s*([^<]+)<\/li>/);
    const reachMatch = html.match(/Reach:<\/i><\/span>\s*([^<]+)<\/li>/);
    const stanceMatch = html.match(/STANCE:<\/i><\/span>\s*([^<]+)<\/li>/);
    const dobMatch = html.match(/DOB:<\/i><\/span>\s*([^<]+)<\/li>/);

    const winsMatch = html.match(/<li class="b-list__box-list-item b-list__box-list-item_type_block">Wins:<\/li>\s*<li class="b-list__box-list-item b-list__box-list-item_type_block">(\d+)<\/li>/);
    const lossesMatch = html.match(/<li class="b-list__box-list-item b-list__box-list-item_type_block">Losses:<\/li>\s*<li class="b-list__box-list-item b-list__box-list-item_type_block">(\d+)<\/li>/);
    const drawsMatch = html.match(/<li class="b-list__box-list-item b-list__box-list-item_type_block">Draws:<\/li>\s*<li class="b-list__box-list-item b-list__box-list-item_type_block">(\d+)<\/li>/);

    const slug = url.split('/').filter(Boolean).pop();

    return {
      slug,
      height: heightMatch ? heightMatch[1].trim() : 'N/A',
      reach: reachMatch ? reachMatch[1].trim() : 'N/A',
      stance: stanceMatch ? stanceMatch[1].trim() : 'N/A',
      weight_class: weightClassMatch ? weightClassMatch[1].trim() : 'N/A',
      dob: dobMatch ? dobMatch[1].trim() : 'N/A',
      wins: winsMatch ? parseInt(winsMatch[1], 10) : null,
      losses: lossesMatch ? parseInt(lossesMatch[1], 10) : null,
      draws: drawsMatch ? parseInt(drawsMatch[1], 10) : null,
      url,
    };
  } catch (e) {
    console.error('Error fetching fighter details:', e);
    return null;
  }
}
