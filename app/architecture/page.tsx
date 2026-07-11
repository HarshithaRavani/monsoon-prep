import Link from 'next/link';
import { getWeatherBriefing } from '@/services/monsoonService';

export const revalidate = 60;

export default async function ArchitecturePage() {
  const briefing = await getWeatherBriefing();

  return (
    <main>
      <section className="card">
        <h1>Explainable architecture</h1>
        <p>This platform is structured around feature modules, shared services, and disaster strategies that can grow over time.</p>
        <p style={{ marginTop: 8 }}><strong>Current live context:</strong> {briefing.summary}</p>
        <div className="grid">
          <article className="card">
            <h2>Frontend</h2>
            <p>Next.js app router with responsive cards and reusable UI modules.</p>
          </article>
          <article className="card">
            <h2>Backend</h2>
            <p>API routes and domain services for weather, risk, and reports.</p>
          </article>
          <article className="card">
            <h2>Data</h2>
            <p>Structured types and module configuration for disaster-specific logic.</p>
          </article>
          <article className="card">
            <h2>Runtime flow</h2>
            <p>Weather briefing, risk generation, and kit personalization are driven by live service responses.</p>
          </article>
        </div>
        <p style={{ marginTop: 16 }}>
          <Link href="/">Back to dashboard</Link>
        </p>
      </section>
    </main>
  );
}
