import Link from 'next/link';
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls';
import { LiveDashboard } from '@/components/live/LiveDashboard';

export default function HomePage() {
  return <main>
    <AccessibilityControls />
    <section className="hero card">
      <div className="hero__content">
        <span className="badge">Monsoon Prep</span>
        <h1>Preparedness based on your real location</h1>
        <p>Load current weather, receive a transparent risk calculation, plan supplies, coordinate family members, and share observed hazards.</p>
        <div className="hero__actions"><Link href="/prepare" className="button-link">Open preparation plan</Link><Link href="/community" className="button-link button-link--secondary">Community reports</Link></div>
      </div>
    </section>
    <LiveDashboard />
  </main>;
}
