# Event Redirect Website

This is a lightweight, mobile-friendly landing page that reads event data and branding settings from JSON files.

## Run locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Customize branding

Edit the values in `data/branding.json` to change:

- company name
- tagline
- logo path
- logo alt text
- colors
- heading font
- body font

Example:

```json
{
  "companyName": "Northstar Events",
  "tagline": "Community & Innovation",
  "logo": "assets/logo.svg",
  "primaryColor": "#0f172a",
  "primarySoftColor": "#1d4ed8",
  "accentColor": "#22c55e",
  "headingFont": "\"Poppins\", \"Segoe UI\", sans-serif",
  "bodyFont": "\"Inter\", \"Segoe UI\", sans-serif"
}
```

## Customize events

Edit `data/events.json` and add or change items inside the `events` array.

Each event supports:

- title
- date
- time
- location
- website
- image
- category

This keeps the page easy to maintain for many events and lets you reuse the same design across different brands.
