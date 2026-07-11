import Link from 'next/link';
import { LiveDashboard } from '@/components/live/LiveDashboard';
import { PreparationChecklist } from '@/components/modules/PreparationChecklist';

export default function PreparePage() {
  return <main><section className="card"><span className="badge">Preparation plan</span><h1>Prepare your household</h1><p>Choose your location for current weather and risk guidance, then track real preparation progress on this device.</p></section><LiveDashboard compact /><PreparationChecklist /><p><Link href="/">Back to dashboard</Link></p></main>;
}
