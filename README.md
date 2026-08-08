# Henley Passport Index Analytics Dashboard

An enterprise BI dashboard for analyzing 20 years of global passport mobility data (2006-2026). Features interactive historical rank trajectories, volatility scoring, visa-free access tracking, and regional metric filtering to derive actionable insights from macro travel trends.

## Features

- **Executive Dashboard:** Macro-level KPIs and metrics tracking global average ranks, largest improvements, and declines over time.
- **Interactive Data Visualizations:** Multi-line trajectory charts using Recharts for comparing passport rankings and visa-free access growth.
- **Deep-Dive Comparisons:** Side-by-side matrices and charting tools to compare up to 5 specific passports over a 20-year span.
- **Advanced Filtering:** Filter analytics by UN regions, continents, and specific years.
- **Premium Glassmorphism UI:** Built with Tailwind CSS, featuring full dark and light mode support with modern aesthetics.

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Vanilla CSS & PostCSS)
- **Data Visualization:** Recharts
- **Icons:** Lucide React

## Running Locally

To run this project locally, clone the repository and install the dependencies:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Deployment

This project is configured as a static Single Page Application (SPA). It can be easily deployed for free on platforms like Vercel, Netlify, or GitHub Pages.

- **Vercel:** Connect the GitHub repository and deploy. Vercel will auto-detect the Vite configuration.
- **Netlify:** Connect the repository and ensure the build command is set to `npm run build` and the publish directory is set to `dist`.

## License

MIT License
