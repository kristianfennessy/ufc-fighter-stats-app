# UFC Fighter Stats — Next.js (Real-time)

This Next.js project fetches fighter data in real-time from the Octagon API and provides a comparison UI with charts.

## How it works

- `pages/api/fighter.js` proxies requests to the Octagon API (`https://api.octagon-api.com`) and returns fighter details.
- The frontend calls `/api/fighter?name=Jon Jones` to get real-time data (no CORS issues).
- Charts use Chart.js (react-chartjs-2).
