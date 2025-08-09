import fetch from 'node-fetch';
import cheerio from 'cheerio';

const UFC_BASE = 'https://www.ufcstats.com';

async function fetchFightersList() {
  const res = await fetch(`${UFC_BASE}/statistics/fighters`);
  if (!res.ok) throw new Error('Failed to fetch fighters list');

  const html = await res.text();
  const $ = cheerio.load(html);

  const fighters = [];

  // Scrape fighters from the table rows
  $('table.b-statistics__table tbody tr').each((_, el) => {
    const anchor = $(el).find('td.b-statistics__table-col a[href*="/fighter-details/"]');
    if (anchor.length === 0) return;

    const url = anchor.attr('href');
    const name = anchor.text().trim();

    if (url && name) {
      const id = url.replace(`${UFC_BASE}/`, '');
      fighters.push({ id, name });
    }
  });

  return fighters;
}

async function fetchFighterDetails(id) {
  const url = `${UFC_BASE}/${id}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch fighter details');

  const html = await res.text();
  const $ = cheerio.load(html);

  const personalInfo = {};
  $('div.b-list__info-box').first().find('ul.b-list__box-list li').each((_, el) => {
    const label = $(el).find('i').text().trim().replace(':', '');
    const value = $(el).contents().filter(function () {
      return this.type === 'text';
    }).text().trim();
    personalInfo[label.toLowerCase()] = value;
  });

  const recordInfo = {};
  $('div.b-list__info-box').eq(1).find('ul.b-list__box-list li').each((_, el) => {
    const label = $(el).find('i').text().trim().replace(':', '');
    const value = $(el).contents().filter(function () {
      return this.type === 'text';
    }).text().trim();

    recordInfo[label.toLowerCase()] = value;
  });

  const parseIntOrZero = (str) => parseInt(str) || 0;

  return {
    id,
    name: $('h2.b-content__title').text().trim(),
    height: personalInfo['height'] || 'N/A',
    reach: personalInfo['reach'] || 'N/A',
    stance: personalInfo['stance'] || 'N/A',
    weight_class: personalInfo['weight class'] || 'N/A',
    dob: personalInfo['dob'] || 'N/A',
    wins: parseIntOrZero(recordInfo['wins']),
    losses: parseIntOrZero(recordInfo['losses']),
    draws: parseIntOrZero(recordInfo['draws']),
    url,
  };
}

export default async function handler(req, res) {
  try {
    const { search, id } = req.query;

    if (search) {
      const fighters = await fetchFightersList();
      const matches = fighters.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
      );
      return res.status(200).json(matches);
    }

    if (id) {
      const details = await fetchFighterDetails(id);
      return res.status(200).json(details);
    }

    return res.status(400).json({ error: 'Missing search or id parameter' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
