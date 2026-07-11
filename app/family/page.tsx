import Link from 'next/link';
import { FamilyMembersPanel } from '@/components/modules/FamilyMembersPanel';
import { getHouseholdRisk, getWeatherBriefing } from '@/services/monsoonService';

export const revalidate = 60;

export default async function FamilyPage() {
  const [briefing, risk] = await Promise.all([getWeatherBriefing(), getHouseholdRisk()]);

  return (
    <main>
      <section className="card">
        <span className="badge">Family coordination</span>
        <h1>Family dashboard</h1>
        <p>Coordinate with family members, confirm readiness steps, and keep shared notes in one view.</p>
        <p style={{ marginTop: 8 }}><strong>Live update:</strong> {briefing.summary}</p>
        <p><strong>Current risk level:</strong> {risk.level}</p>
        <FamilyMembersPanel />
        <p style={{ marginTop: 16 }}>
          <Link href="/">Back to dashboard</Link>
        </p>
      </section>
    </main>
  );
}
