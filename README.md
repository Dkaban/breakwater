# Breakwater 🌊

**A global surf forecast dashboard.** Explore predicted ocean conditions in Tofino, Nazaré, and surf locations around the world.

Breakwater is a lightweight, responsive website that uses [Open-Meteo](https://open-meteo.com/) forecast APIs. The initial version is a single HTML file with embedded CSS and JavaScript — no framework, installation, build tools, or API key required for the prototype.

## Features

- **Preset locations** including Tofino, Nazaré, Pipeline, and Bells Beach
- **Worldwide place search** via Open-Meteo's geocoding API
- **Custom coordinates** for specific offshore surf spots
- **Wave and swell data** including significant wave height, swell height, direction, and period
- **Wind and water temperature** alongside marine conditions
- **24-hour and 72-hour** interactive wave forecast views
- **7-day outlook** showing daily maximum forecast wave height
- **Saved spots and unit preferences** stored locally in your browser
- **Responsive layout** for desktop and mobile

## Quick start

### Option 1: Open the file

Download or clone this repository and open `index.html` in a modern browser with an internet connection.

### Option 2: Run a local server

From the project folder, run:

```bash
python -m http.server 8000
```

Then visit **http://localhost:8000**.

No `npm install` or environment variables are needed.

## Project structure

```text
breakwater-surf-dashboard/
├── index.html     # Website HTML, styling, and JavaScript
├── README.md      # Project documentation
└── .gitignore     # Files Git should ignore (optional)
```

**Only `index.html` is required to serve the site.** The README is recommended for your GitHub repository; `.gitignore` is optional for the current version.

## Publish with GitHub Pages

1. Upload `index.html` and `README.md` to the **root** of your GitHub repository (you can also upload `.gitignore`).
2. Commit the files to the `main` branch.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main`, set the folder to `/ (root)`, and save.
6. Once deployment finishes, GitHub Pages will display the site's URL, typically:

   `https://YOUR_USERNAME.github.io/REPOSITORY_NAME/`

If the repository is private, GitHub Pages availability depends on your plan and repository settings.

## Data sources

Breakwater requests data directly from:

- [Open-Meteo Marine Weather API](https://open-meteo.com/en/docs/marine-weather-api) — ocean wave, swell, and sea-surface-temperature forecasts
- [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs) — wind speed and direction
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) — worldwide location search

API availability, licensing, usage limits, and commercial-use conditions are governed by Open-Meteo's current terms. Review them before operating a public or commercial service.

## Important forecast limitations

**This is an early prototype, not a surf-safety or navigation service.** Forecast wave height is a model estimate and **not** the measured height of breaking waves at the beach. Local reefs, bathymetry, tides, shoreline shape, and wind can substantially change actual surf. This is especially important at Nazaré, where the underwater canyon affects breaking waves.

Location search identifies towns and other places, **not** a verified database of surf breaks; enter offshore coordinates for a specific surf spot when needed. Tide predictions, surf quality ratings, spot-specific wind suitability, and safety alerts are not yet included.

Always check local observations and safety advisories before entering the ocean.

## Roadmap

- [ ] Add a map-based surf break picker
- [ ] Build a verified catalog of surf spots
- [ ] Add tide information where supported
- [ ] Add spot-specific surf quality indicators
- [ ] Add favourite-spot comparisons and threshold alerts
- [ ] Separate HTML, CSS, and JavaScript as the project grows
- [ ] Add automated tests and continuous deployment

## License

No open-source license has been selected yet. Add a `LICENSE` file if you want to define reuse and contribution permissions.
