import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { search } = req.query;
  if (!search || search.length < 2) {
    return res.status(400).json([]);
  }
  const q = search.toLowerCase();

  try {
    const response = await fetch('https://www.ufc.com/athletes/all');
    const html = await response.text();

    const $ = cheerio.load(html);
    const fighters = [];

    $('.c-listing-athlete-flipcard__content').each((_, el) => {
      const name = $(el).find('.c-listing-athlete-flipcard__name').text().trim();
      const link = $(el).find('a').attr('href');
      if (name.toLowerCase().includes(q)) {
        fighters.push({ name, url: 'https://www.ufc.com' + link });
      }
    });

    return res.status(200).json(fighters);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch fighters' });
  }
}
