import Link from 'next/link';
import { FamilyMembersPanel } from '@/components/modules/FamilyMembersPanel';

export default function FamilyPage() {
  return <main><section className="card"><span className="badge">Family coordination</span><h1>Family dashboard</h1><p>Add real household members and keep their status current on this device.</p><FamilyMembersPanel /><p><Link href="/">Back to dashboard</Link></p></section></main>;
}
