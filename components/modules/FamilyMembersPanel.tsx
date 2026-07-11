'use client';

import { FormEvent, useEffect, useState } from 'react';

type FamilyMember = {
  id: number;
  name: string;
  status: string;
};

const defaultMembers: FamilyMember[] = [
  { id: 1, name: 'Harshitha', status: 'online' },
  { id: 2, name: 'Parent', status: 'safe' },
  { id: 3, name: 'Sibling', status: 'at school pickup' },
];

const storageKey = 'monsoon-prep-family-members';

export function FamilyMembersPanel() {
  const [members, setMembers] = useState<FamilyMember[]>(defaultMembers);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('safe');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedMembers = window.localStorage.getItem(storageKey);
      if (savedMembers) {
        const parsed = JSON.parse(savedMembers) as FamilyMember[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembers(parsed);
        }
      }
    } catch {
      // Ignore malformed storage and fall back to defaults.
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(storageKey, JSON.stringify(members));
  }, [members, isReady]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setMembers((currentMembers) => [
      {
        id: Date.now(),
        name: trimmedName,
        status: status.trim() || 'safe',
      },
      ...currentMembers,
    ]);
    setName('');
    setStatus('safe');
  };

  return (
    <div className="grid">
      <article className="card">
        <h2>Members</h2>
        <form className="family-form" onSubmit={handleSubmit}>
          <label className="family-form__field">
            <span>Name</span>
            <input
              className="family-form__input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Add a family member"
            />
          </label>
          <label className="family-form__field">
            <span>Status</span>
            <select className="family-form__select" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="safe">Safe</option>
              <option value="online">Online</option>
              <option value="at school pickup">At school pickup</option>
              <option value="away">Away</option>
            </select>
          </label>
          <button type="submit">Add member</button>
        </form>
        <ul className="family-list">
          {members.map((member) => (
            <li key={member.id} className="family-member">
              <strong>{member.name}</strong> — {member.status}
            </li>
          ))}
        </ul>
      </article>
      <article className="card">
        <h2>Shared checklist</h2>
        <ul>
          <li>Charge phones and power banks</li>
          <li>Store water and medicines</li>
          <li>Confirm backup contacts</li>
        </ul>
      </article>
    </div>
  );
}
