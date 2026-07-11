'use client';

import { useEffect, useState } from 'react';
const items = ['Store drinking water', 'Pack essential medicines', 'Charge phones and power banks', 'Protect important documents', 'Check drains and safe exits'];
const storageKey = 'monsoon-prep-checklist';

export function PreparationChecklist() {
  const [checked, setChecked] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setChecked(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { setChecked([]); } setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(storageKey, JSON.stringify(checked)); }, [checked, ready]);
  return <article className="card"><h2>Your readiness checklist</h2><p>{checked.length} of {items.length} completed on this device.</p><ul className="checklist">{items.map((item) => <li key={item}><label><input type="checkbox" checked={checked.includes(item)} onChange={() => setChecked((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} />{item}</label></li>)}</ul></article>;
}
