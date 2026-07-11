'use client';

import { FormEvent, useState } from 'react';
import type { AiGuidance, PreparednessPhase } from '@/types/monsoon';

type Place = { label: string; latitude: number; longitude: number };

export function AiGuidancePanel({ place }: { place: Place }) {
  const [language, setLanguage] = useState('English');
  const [phase, setPhase] = useState<PreparednessPhase>('before');
  const [householdProfile, setHouseholdProfile] = useState('');
  const [travelPlans, setTravelPlans] = useState('');
  const [guidance, setGuidance] = useState<AiGuidance | null>(null);
  const [meta, setMeta] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError(''); setGuidance(null);
    try {
      const response = await fetch('/api/ai-guidance', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...place, locationLabel: place.label, language, phase, householdProfile, travelPlans }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Guidance request failed.');
      setGuidance(payload.guidance as AiGuidance);
      setMeta(`Generated ${new Date(payload.generatedAt).toLocaleString()} with ${payload.model}`);
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Guidance is unavailable.'); }
    finally { setLoading(false); }
  };

  return <section className="card ai-panel">
    <p className="badge">Gemini-powered</p><h2>Personalized monsoon guidance</h2>
    <p>Gemini combines fresh Open-Meteo conditions with the details you provide. Do not enter sensitive personal information. Generated guidance is not an official emergency alert.</p>
    <form className="family-form" onSubmit={submit}>
      <div className="grid">
        <label className="family-form__field"><span>Response language</span><select className="family-form__select" value={language} onChange={(event) => setLanguage(event.target.value)}><option>English</option><option>Hindi</option><option>Kannada</option><option>Tamil</option><option>Telugu</option><option>Marathi</option></select></label>
        <label className="family-form__field"><span>Weather-event phase</span><select className="family-form__select" value={phase} onChange={(event) => setPhase(event.target.value as PreparednessPhase)}><option value="before">Before severe weather</option><option value="during">During severe weather</option><option value="after">After severe weather</option></select></label>
      </div>
      <label className="family-form__field"><span>Household needs</span><textarea className="family-form__input" maxLength={500} required value={householdProfile} onChange={(event) => setHouseholdProfile(event.target.value)} placeholder="Example: 4 people, one senior citizen, a child, essential medicines, apartment on ground floor" /></label>
      <label className="family-form__field"><span>Travel plans (optional)</span><textarea className="family-form__input" maxLength={300} value={travelPlans} onChange={(event) => setTravelPlans(event.target.value)} placeholder="Example: Commuting by bus at 6 PM" /></label>
      <button type="submit" disabled={loading}>{loading ? 'Generating from live conditions…' : 'Generate real AI guidance'}</button>
    </form>
    {error && <p className="error-status" role="alert">{error}</p>}
    {guidance && <div className="ai-output" aria-live="polite">
      <h3>{guidance.headline}</h3><p>{guidance.riskSummary}</p>
      <div className="grid"><GuidanceList title="Personalized plan" items={guidance.personalizedPlan} /><GuidanceList title="Emergency checklist" items={guidance.emergencyChecklist} /><GuidanceList title="Safety recommendations" items={guidance.safetyRecommendations} /><GuidanceList title={`${phase[0].toUpperCase()}${phase.slice(1)}-event alerts`} items={guidance.alerts} /></div>
      <article className="card"><h4>Travel advisory</h4><p>{guidance.travelAdvisory}</p></article>
      <p className="data-status"><strong>Safety notice:</strong> {guidance.disclaimer}</p><p className="report-meta">{meta}</p>
    </div>}
  </section>;
}

function GuidanceList({ title, items }: { title: string; items: string[] }) {
  return <article className="card"><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}
