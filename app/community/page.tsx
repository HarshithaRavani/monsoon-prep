import Link from 'next/link';
import { CommunityReportsPanel } from '@/components/modules/CommunityReportsPanel';

export default function CommunityPage() {
  return <main><section className="card"><span className="badge">Community observations</span><h1>Report local conditions</h1><p>Record hazards you personally observe. For emergency decisions, follow your local government and emergency services.</p><CommunityReportsPanel /><p><Link href="/">Back to dashboard</Link></p></section></main>;
}
