import type { WeatherBriefing } from '@/types/monsoon';

interface Props {
  briefing: WeatherBriefing;
}

export function WeatherBriefingCard({ briefing }: Props) {
  const riskTone = briefing.riskLevel === 'High' || briefing.riskLevel === 'Severe' ? 'risk-pill risk-pill--high' : briefing.riskLevel === 'Moderate' ? 'risk-pill risk-pill--moderate' : 'risk-pill risk-pill--low';

  return (
    <section className="card weather-card">
      <div className="weather-card__top">
        <div>
          <p className="badge">Weather briefing</p>
          <h2>{briefing.title}</h2>
        </div>
        <div className={riskTone}>{briefing.riskLevel}</div>
      </div>
      <div className="weather-card__hero">
        <div className="weather-card__visual" aria-hidden="true">
          <span>🌧️</span>
        </div>
        <div>
          <p className="weather-card__location">{briefing.location}</p>
          <p className="weather-card__temp">{briefing.temperature}</p>
          <p className="weather-card__summary">{briefing.summary}</p>
        </div>
      </div>
      <div className="weather-metrics">
        {briefing.metrics.map((metric) => (
          <div key={metric.label} className="weather-metric">
            <span className="weather-metric__icon">{metric.icon}</span>
            <div>
              <p className="weather-metric__label">{metric.label}</p>
              <p className="weather-metric__value">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="weather-card__details">
        <p><strong>Recommended action:</strong> {briefing.nextAction}</p>
      </div>
    </section>
  );
}
