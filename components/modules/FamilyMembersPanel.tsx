'use client';

import { FormEvent, useEffect, useState } from 'react';

type FamilyMember = { id: string; name: string; status: string; updatedAt: string };
const storageKey = 'monsoon-prep-family-members';

export function FamilyMembersPanel() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Safe');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setMembers(JSON.parse(window.localStorage.getItem(storageKey) || '[]')); } catch { setMembers([]); }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) window.localStorage.setItem(storageKey, JSON.stringify(members)); }, [members, ready]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setMembers((current) => [{ id: crypto.randomUUID(), name: name.trim(), status, updatedAt: new Date().toISOString() }, ...current]);
    setName('');
  };

  const updateStatus = (id: string, nextStatus: string) => setMembers((current) => current.map((member) => member.id === id ? { ...member, status: nextStatus, updatedAt: new Date().toISOString() } : member));

  return <article className="card">
    <h2>Family status board</h2>
    <p>Only members you add are shown. Updates are stored on this device.</p>
    <form className="family-form" onSubmit={submit}>
      <label className="family-form__field"><span>Name</span><input className="family-form__input" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Family member name" /></label>
      <label className="family-form__field"><span>Status</span><select className="family-form__select" value={status} onChange={(event) => setStatus(event.target.value)}><option>Safe</option><option>Needs help</option><option>Travelling</option><option>Unreachable</option></select></label>
      <button type="submit">Add member</button>
    </form>
    {ready && members.length === 0 && <p className="data-status">No family members added yet.</p>}
    <ul className="family-list">{members.map((member) => <li key={member.id} className="family-member">
      <strong>{member.name}</strong>
      <select aria-label={`Status for ${member.name}`} value={member.status} onChange={(event) => updateStatus(member.id, event.target.value)}><option>Safe</option><option>Needs help</option><option>Travelling</option><option>Unreachable</option></select>
      <small>Updated {new Date(member.updatedAt).toLocaleString()}</small>
      <button type="button" onClick={() => setMembers((current) => current.filter((item) => item.id !== member.id))}>Remove</button>
    </li>)}</ul>
  </article>;
}
