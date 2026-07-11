import Link from 'next/link';
import { getHouseholdRisk, getWeatherBriefing } from '@/services/monsoonService';

export const revalidate = 60;

export default async function PreparePage() {
  const [briefing, risk] = await Promise.all([getWeatherBriefing(), getHouseholdRisk()]);

  return (
    <main>
      <section className="card">
        <span className="badge">Preparation plan</span>
        <h1>Prepare your household</h1>
        <p>Track your emergency kit, review key checks, and prepare a practical household plan before heavy rain arrives.</p>
        <p style={{ marginTop: 8 }}><strong>Live update:</strong> {briefing.summary}</p>
        <p><strong>Current risk level:</strong> {risk.level}</p>
        <div className="grid">
          <article className="card">
            <h2>Emergency checklist</h2>
            <ul>
              <li>Water stored for at least two days</li>
              <li>Flashlights and power banks charged</li>
              <li>Documents copied and kept safely</li>
              <li>Medications and infant or pet supplies packed</li>
            </ul>
          </article>
          <article className="card">
            <h2>Home readiness</h2>
            <p>Keep your windows, drains, and exits clear before heavy rain, and move valuables to higher ground if flooding is possible.</p>
          </article>
        </div>
        <p style={{ marginTop: 16 }}>
          <Link href="/">Back to dashboard</Link>
        </p>
      </section>
    </main>
  );
}
