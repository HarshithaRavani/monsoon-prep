'use client';

import { useEffect, useState } from 'react';

export function AccessibilityControls() {
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const storedLargeText = window.localStorage.getItem('monsoon-large-text') === 'true';
    const storedHighContrast = window.localStorage.getItem('monsoon-high-contrast') === 'true';
    const storedReducedMotion = window.localStorage.getItem('monsoon-reduced-motion') === 'true';

    setLargeText(storedLargeText);
    setHighContrast(storedHighContrast);
    setReducedMotion(storedReducedMotion);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.largeText = String(largeText);
    document.documentElement.dataset.highContrast = String(highContrast);
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
    document.documentElement.classList.toggle('large-text', largeText);
    document.documentElement.classList.toggle('high-contrast', highContrast);
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    window.localStorage.setItem('monsoon-large-text', String(largeText));
    window.localStorage.setItem('monsoon-high-contrast', String(highContrast));
    window.localStorage.setItem('monsoon-reduced-motion', String(reducedMotion));
  }, [largeText, highContrast, reducedMotion]);

  return (
    <section className="card" aria-label="Accessibility controls" style={{ marginBottom: 16 }}>
      <h2 style={{ marginTop: 0 }}>Accessibility options</h2>
      <div className="grid">
        <label>
          <input type="checkbox" checked={largeText} onChange={() => setLargeText((value) => !value)} />
          {' '}Large text mode
        </label>
        <label>
          <input type="checkbox" checked={highContrast} onChange={() => setHighContrast((value) => !value)} />
          {' '}High contrast
        </label>
        <label>
          <input type="checkbox" checked={reducedMotion} onChange={() => setReducedMotion((value) => !value)} />
          {' '}Reduced motion
        </label>
      </div>
    </section>
  );
}
