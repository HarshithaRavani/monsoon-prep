import type { HouseholdRiskScore } from '@/types/monsoon';

interface Props {
  risk: HouseholdRiskScore;
}

export function RiskScoreCard({ risk }: Props) {
  return (
    <section className="card risk-card">
      <div className="card-heading">
        <p className="badge">Household risk overview</p>
        <div className="score-ring">{risk.score}</div>
      </div>
      <h2>Risk Score: {risk.score}/100</h2>
      <p>{risk.explanation}</p>
      <div className="status-row">
        <span className="status-chip">Preparedness: {risk.preparednessLevel}</span>
        <span className="status-chip">Evacuation: {risk.evacuationReadiness}</span>
      </div>
      <ul>
        {risk.priorityActions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
      <p><strong>Suggested supplies:</strong> {risk.recommendedSupplies.join(', ')}</p>
    </section>
  );
}
