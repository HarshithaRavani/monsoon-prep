import Link from 'next/link';
import { getCommunityReports, getWeatherBriefing } from '@/services/monsoonService';

export const revalidate = 60;

export default async function CommunityPage() {
  const [briefing, reports] = await Promise.all([getWeatherBriefing(), getCommunityReports()]);

  return (
    <main>
      <section className="card">
        <span className="badge">Community vigilance</span>
        <h1>Community verification</h1>
        <p>Review local hazard observations, verify reports, and support neighbors with accurate information.</p>
        <p style={{ marginTop: 8 }}><strong>Live update:</strong> {briefing.summary}</p>
        <div className="grid">
          <article className="card">
            <h2>Recent reports</h2>
            <ul>
              {reports.map((report) => (
                <li key={report.id}>
                  <strong>{report.type}</strong> — {report.location}: {report.description}
                </li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h2>Verification status</h2>
            <p>Trusted reports get higher confidence and better visibility, encouraging residents to act early.</p>
          </article>
        </div>
        <p style={{ marginTop: 16 }}>
          <Link href="/">Back to dashboard</Link>
        </p>
      </section>
    </main>
  );
}
