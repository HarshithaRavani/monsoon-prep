import Link from 'next/link';
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls';
import { WeatherBriefingCard } from '@/components/modules/WeatherBriefingCard';
import { RiskScoreCard } from '@/components/modules/RiskScoreCard';
import { CommunityReportsCard } from '@/components/modules/CommunityReportsCard';
import { EmergencyKitCard } from '@/components/modules/EmergencyKitCard';
import { disasterModules } from '@/lib/disaster-config';
import { getCommunityReports, getEmergencyKit, getHouseholdRisk, getWeatherBriefing } from '@/services/monsoonService';

export const revalidate = 60;

export default async function HomePage() {
  const [briefing, risk, reports, kit] = await Promise.all([
    getWeatherBriefing(),
    getHouseholdRisk(),
    getCommunityReports(),
    getEmergencyKit(),
  ]);

  return (
    <main>
      <AccessibilityControls />

      <section className="hero card">
        <div className="hero__content">
          <span className="badge">Monsoon Prep</span>
          <h1>Stay ahead of the storm</h1>
          <p>
            This experience combines weather updates, household preparation steps, and community reporting in one practical preparedness hub.
          </p>
          <div className="hero__actions">
            <Link href="/prepare" className="button-link">Start preparing</Link>
            <Link href="/community" className="button-link button-link--secondary">Go to community page</Link>
          </div>
        </div>
      </section>

      <section className="grid" style={{ marginBottom: 20 }}>
        <WeatherBriefingCard briefing={briefing} />
        <RiskScoreCard risk={risk} />
        <CommunityReportsCard reports={reports} />
        <EmergencyKitCard kit={kit} />
      </section>

      <section className="card">
        <h2>Preparedness paths</h2>
        <div className="grid">
          <article className="card">
            <h3>Prepare</h3>
            <p>Build your home readiness checklist and emergency kit.</p>
            <Link href="/prepare">Open prepare view</Link>
          </article>
          <article className="card">
            <h3>Community</h3>
            <p>See nearby reports and verify trusted hazards.</p>
            <Link href="/community">Visit community page</Link>
          </article>
          <article className="card">
            <h3>Family</h3>
            <p>Coordinate family check-ins and shared notes.</p>
            <Link href="/family">Open family view</Link>
          </article>
        </div>
        <div className="grid" style={{ marginTop: 16 }}>
          {disasterModules.map((module) => (
            <article key={module.id} className="card">
              <h3>{module.label}</h3>
              <p>{module.description}</p>
              <p><strong>Strategy:</strong> {module.strategy}</p>
            </article>
          ))}
        </div>
        <p style={{ marginTop: 16 }}>
          <Link href="/architecture">Open architecture view</Link>
        </p>
      </section>
    </main>
  );
}
