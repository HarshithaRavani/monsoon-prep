import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name')?.trim();
  if (!name || name.length < 2) return Response.json({ error: 'Enter at least two characters.' }, { status: 400 });
  try {
    const params = new URLSearchParams({ name, count: '8', language: 'en', format: 'json' });
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Location search failed.');
    const payload = await response.json() as { results?: Array<{ id: number; name: string; admin1?: string; country?: string; latitude: number; longitude: number }> };
    return Response.json((payload.results ?? []).map((item) => ({
      id: item.id,
      label: [item.name, item.admin1, item.country].filter(Boolean).join(', '),
      latitude: item.latitude,
      longitude: item.longitude,
    })));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Location search is unavailable.' }, { status: 502 });
  }
}
