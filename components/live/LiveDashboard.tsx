'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { WeatherBriefingCard } from '@/components/modules/WeatherBriefingCard';
import { RiskScoreCard } from '@/components/modules/RiskScoreCard';
import { EmergencyKitCard } from '@/components/modules/EmergencyKitCard';
import type { DashboardData } from '@/types/monsoon';

type Place = { id?: number; label: string; latitude: number; longitude: number };
const locationKey = 'monsoon-prep-location';

export function LiveDashboard({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [status, setStatus] = useState('Choose “Use my location” or search for a city to load current weather data.');
  const [loading, setLoading] = useState(false);

  const loadPlace = useCallback(async (place: Place) => {
    setLoading(true);
    setStatus(`Loading current conditions for ${place.label}…`);
    setResults([]);
    try {
      const params = new URLSearchParams({ latitude: String(place.latitude), longitude: String(place.longitude), label: place.label });
      const response = await fetch(`/api/dashboard?${params}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Weather request failed.');
      setData(payload as DashboardData);
      window.localStorage.setItem(locationKey, JSON.stringify(place));
      setStatus('');
    } catch (error) {
      setData(null);
      setStatus(error instanceof Error ? error.message : 'Weather is currently unavailable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(locationKey);
    if (!saved) return;
    try { void loadPlace(JSON.parse(saved) as Place); } catch { window.localStorage.removeItem(locationKey); }
  }, [loadPlace]);

  const useDeviceLocation = () => {
    if (!navigator.geolocation) { setStatus('Location services are not supported by this browser. Search for a city instead.'); return; }
    setLoading(true);
    setStatus('Waiting for location permission…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => void loadPlace({ label: 'Your current location', latitude: coords.latitude, longitude: coords.longitude }),
      () => { setLoading(false); setStatus('Location permission was not granted. Search for a city instead.'); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  const search = async (event: FormEvent) => {
    event.preventDefault();
    if (query.trim().length < 2) { setStatus('Enter at least two characters.'); return; }
    setLoading(true);
    setStatus('Searching locations…');
    try {
      const response = await fetch(`/api/locations?name=${encodeURIComponent(query.trim())}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Location search failed.');
      setResults(payload as Place[]);
      setStatus(payload.length ? 'Select the correct location.' : 'No matching locations found.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Location search is unavailable.'); }
    finally { setLoading(false); }
  };

  return (
    <section aria-live="polite">
      <div className="card location-panel">
        <div>
          <p className="badge">Live location</p>
          <h2>Choose your weather location</h2>
          <p>Weather is fetched only after you choose a real location. No sample conditions are displayed.</p>
        </div>
        <button type="button" onClick={useDeviceLocation} disabled={loading}>Use my location</button>
        <form className="location-search" onSubmit={search}>
          <label htmlFor="location-query">City or place</label>
          <div className="location-search__row">
            <input id="location-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search any city or country" />
            <button type="submit" disabled={loading}>Search</button>
          </div>
        </form>
        {status && <p className="data-status">{status}</p>}
        {results.length > 0 && <ul className="location-results">{results.map((place) => (
          <li key={`${place.id ?? place.label}-${place.latitude}`}><button type="button" onClick={() => void loadPlace(place)}>{place.label}</button></li>
        ))}</ul>}
      </div>
      {data && <div className="grid live-results">
        <WeatherBriefingCard briefing={data.briefing} />
        <RiskScoreCard risk={data.risk} />
        {!compact && <EmergencyKitCard kit={data.kit} />}
      </div>}
    </section>
  );
}
