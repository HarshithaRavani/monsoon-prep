'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { CommunityReport } from '@/types/monsoon';
const storageKey = 'monsoon-prep-community-reports';

export function CommunityReportsPanel() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [type, setType] = useState('Flooding');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setReports(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { setReports([]); } setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(storageKey, JSON.stringify(reports)); }, [reports, ready]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!location.trim() || !description.trim()) return;
    setReports((current) => [{ id: crypto.randomUUID(), type, location: location.trim(), description: description.trim(), timestamp: new Date().toISOString() }, ...current]);
    setLocation(''); setDescription('');
  };
  return <div className="grid">
    <article className="card"><h2>Submit an observation</h2><p>Reports are clearly user-submitted and are not presented as verified official alerts.</p>
      <form className="family-form" onSubmit={submit}>
        <label className="family-form__field"><span>Hazard</span><select className="family-form__select" value={type} onChange={(event) => setType(event.target.value)}><option>Flooding</option><option>Heavy rain</option><option>Blocked road</option><option>Power outage</option><option>Other</option></select></label>
        <label className="family-form__field"><span>Location</span><input className="family-form__input" value={location} onChange={(event) => setLocation(event.target.value)} required /></label>
        <label className="family-form__field"><span>What did you observe?</span><textarea className="family-form__input" value={description} onChange={(event) => setDescription(event.target.value)} required /></label>
        <button type="submit">Save report</button>
      </form>
    </article>
    <article className="card"><h2>Your submitted reports</h2>{ready && reports.length === 0 && <p className="data-status">No observations submitted on this device.</p>}
      {reports.map((report) => <div className="report-item" key={report.id}><strong>{report.type}</strong><p>{report.location}: {report.description}</p><p className="report-meta">Submitted {new Date(report.timestamp).toLocaleString()} · Unverified community observation</p><button type="button" onClick={() => setReports((current) => current.filter((item) => item.id !== report.id))}>Delete</button></div>)}
    </article>
  </div>;
}
