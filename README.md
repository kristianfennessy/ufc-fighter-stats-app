# UFC Fighter Stats — Next.js (Real-time)

This Next.js project fetches fighter data in real-time from the Octagon API and provides a comparison UI with charts.

## How it works
- `pages/api/fighter.js` proxies requests to the Octagon API (`https://api.octagon-api.com`) and returns fighter details.
- The frontend calls `/api/fighter?name=Jon Jones` to get real-time data (no CORS issues).
- Charts use Chart.js (react-chartjs-2).

## Setup & Run Locally
1. Install deps:
   ```
   npm install
   ```
2. Run dev:
   ```
   npm run dev
   ```
3. Open: http://localhost:3000

## Environment
- `OCTAGON_API_BASE` (optional) - override API base URL.

## Deploy to Vercel
1. Push to GitHub.
2. Import repo in Vercel dashboard and deploy.
3. Vercel will deploy both frontend and API routes automatically.

## Notes
- Octagon API is an open project (https://api.octagon-api.com). If you prefer a paid/official data source (SportsDataIO, API-Sports, RapidAPI), update `pages/api/fighter.js` to call that provider and store the API key in Vercel Environment Variables.
