import type { EmergencyKit } from '@/types/monsoon';

interface Props {
  kit: EmergencyKit;
}

export function EmergencyKitCard({ kit }: Props) {
  return (
    <section className="card kit-card">
      <div className="card-heading">
        <p className="badge">Emergency kit</p>
        <div className="kit-icon" aria-hidden="true">🎒</div>
      </div>
      <h2>{kit.title}</h2>
      <ul>
        {kit.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
