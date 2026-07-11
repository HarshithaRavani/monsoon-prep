# Monsoon Prep

Monsoon Prep is a responsive household preparedness and community-assistance app built with Next.js. It combines live weather context, risk guidance, emergency planning, community reports, and family coordination in one dashboard.

Every push to `main` is validated by GitHub Actions with linting, 19 automated unit tests, TypeScript checking, and a production build.

## Features

- **Location-aware weather briefing** powered by Open-Meteo. Use browser location or search for any city worldwide.
- **Truthful failure states** that show when weather or geocoding is unavailable instead of displaying invented fallback conditions.
- **Household risk score** with a severity level, explanation, priority actions, evacuation readiness, and recommended supplies.
- **Personalized emergency kit** that adapts its recommendations to current rainfall.
- **Preparation guide** with an emergency checklist and practical home-readiness advice.
- **Community observations** created by the user and explicitly labelled unverified, with no generated reports presented as real incidents.
- **Family dashboard** for adding, updating, and removing real household members. Family data is saved in the browser with `localStorage`.
- **Accessibility preferences** for large text, high contrast, and reduced motion. Preferences persist in the browser.
- **Persistent readiness checklist** that records the user's actual progress.
- **Real Gemini guidance** based on fresh weather and user-provided household needs, with structured personalized plans, emergency checklists, travel advisories, safety recommendations, and alerts for before, during, or after severe weather.
- **Multilingual AI output** in English, Hindi, Kannada, Tamil, Telugu, or Marathi.
- **Installable app metadata** through a web app manifest, plus responsive layouts for desktop and mobile.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Main weather, risk, reports, emergency kit, and preparedness dashboard |
| `/prepare` | Household preparation checklist and readiness guidance |
| `/community` | Local hazard reports and verification information |
| `/family` | Family member statuses and a shared checklist |
| `/architecture` | Overview of the app's frontend, backend, data, and runtime design |

## API routes

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/api/health` | `GET` | Returns the service health status |
| `/api/dashboard` | `GET` | Validates coordinates and returns Open-Meteo conditions with calculated risk guidance |
| `/api/locations` | `GET` | Searches real places through Open-Meteo geocoding |
| `/api/ai-guidance` | `POST` | Refreshes weather and requests structured, personalized guidance from Gemini |

The app does not claim to provide authentication or a persistent cloud database. User-created records are clearly stored only on the current device.

## Tech stack

- Next.js 14 App Router
- React 18
- TypeScript
- Open-Meteo weather API
- CSS with responsive and accessibility-aware styles

## Run locally

### Requirements

- Node.js 18.18 or newer
- npm

### Setup

```bash
git clone https://github.com/HarshithaRavani/monsoon-prep.git
cd monsoon-prep
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Weather and geocoding require no environment variables. Gemini guidance requires a server-only `GEMINI_API_KEY`; copy `.env.example` to `.env.local` for local development. If either external service cannot be reached, the UI reports the error and does not substitute sample output.

Create a Gemini API key in Google AI Studio, then add it locally or as a Vercel environment variable:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Never prefix the key with `NEXT_PUBLIC_`; the Gemini request is intentionally performed only by the server route.

## Available scripts

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm run start  # Start the production server
npm run lint   # Run Next.js linting
npm test       # Run automated unit tests
npm run check  # Run lint, tests, and a production build
```

## Testing

The project uses Node's built-in test runner, so no additional testing framework is required. Automated tests cover risk-score boundaries, severity classification, weather-triggered actions and supplies, coordinate validation, location-query normalization, AI request validation, prompt grounding, and injection-resistance instructions. Run the full submission-quality gate with `npm run check`.

## Data model

[`data/schema.sql`](data/schema.sql) contains a starter relational schema for users, families, family members, and reports. The current UI uses service-generated data and browser storage; the schema is ready for a future persistent backend integration.
