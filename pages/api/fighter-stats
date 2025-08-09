import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url param' });

  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    // Example: scrape some stats text - adjust selectors per actual UFC page structure
    // This is a demo with dummy fixed stats, replace with real scraping logic as needed
    const stats = {
      striking: Math.floor(Math.random() * 100),
      grappling: Math.floor(Math.random() * 100),
      defense: Math.floor(Math.random() * 100),
      takedown: Math.floor(Math.random() * 100),
      control: Math.floor(Math.random() * 100)
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
