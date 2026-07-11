import type { CommunityReport } from '@/types/monsoon';

interface Props {
  reports: CommunityReport[];
}

export function CommunityReportsCard({ reports }: Props) {
  return (
    <section className="card report-card">
      <div className="card-heading">
        <p className="badge">Community reports</p>
        <div className="report-icon" aria-hidden="true">📍</div>
      </div>
      <h2>Nearby reports</h2>
      {reports.map((report) => (
        <div key={report.id} className="report-item">
          <div className="report-item__top">
            <strong>{report.type}</strong>
            <span>{report.location}</span>
          </div>
          <p>{report.description}</p>
          <p className="report-meta">Confidence: {report.confidence}% · {report.verified ? 'Verified' : 'Pending'}</p>
        </div>
      ))}
    </section>
  );
}
