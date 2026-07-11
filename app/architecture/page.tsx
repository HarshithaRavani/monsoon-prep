import Link from 'next/link';

export default function ArchitecturePage() {
  return <main><section className="card"><h1>Data transparency</h1><p>The app distinguishes external observations, calculated guidance, and user-created records so demo data is never mistaken for live information.</p><div className="grid">
    <article className="card"><h2>Weather</h2><p>Current conditions come from Open-Meteo for coordinates selected through device location or place search. Errors are shown instead of invented fallback values.</p></article>
    <article className="card"><h2>Risk guidance</h2><p>A deterministic score is calculated from precipitation, rain probability, wind, and weather codes. The inputs and calculation purpose are disclosed in the UI.</p></article>
    <article className="card"><h2>User records</h2><p>Family statuses, checklist progress, chosen location, and community observations are created by the user and stored locally in the browser.</p></article>
    <article className="card"><h2>Limitations</h2><p>This is a preparedness aid, not an official warning system. Community observations are unverified and weather guidance must not replace emergency-service instructions.</p></article>
  </div><p><Link href="/">Back to dashboard</Link></p></section></main>;
}
