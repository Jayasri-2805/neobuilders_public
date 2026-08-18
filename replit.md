# Neo Builders public website

## Run locally / in Replit

- Install dependencies: `npm install`
- Start the preview: `npm run dev -- --host 0.0.0.0 --port 5000`
- Build for production: `npm run build`

## API contract

The public landing page fetches optional site content from `GET /api/v1/public/website`. The UI starts with the bundled Neo Builders preview content and merges API content when the endpoint responds with JSON.

The demo request form submits to `POST /api/v1/crm/leads` with the form fields plus `source: "public-website"` and `requestType: "live-demo"`.

The API is intentionally called with relative URLs so it works through Replit's proxied preview and with the project's existing server. If the content endpoint is unavailable, the footer shows `Using local preview data`; demo submissions show a clear service error instead of silently pretending the lead was saved.
