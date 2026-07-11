import { NextRequest } from 'next/server';
import { buildGuidancePrompt, guidanceResponseSchema, isAiGuidance, validateGuidanceRequest } from '@/lib/ai-guidance';
import { getDashboardData } from '@/services/monsoonService';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 10;
const requests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string) {
  const now = Date.now();
  if (requests.size > 500) requests.forEach((entry, client) => { if (entry.resetAt <= now) requests.delete(client); });
  const current = requests.get(key);
  if (!current || current.resetAt <= now) { requests.set(key, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  const client = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  if (isRateLimited(client)) return Response.json({ error: 'Too many guidance requests. Please try again later.' }, { status: 429 });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ error: 'AI guidance is not configured on this deployment.' }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'A valid JSON request is required.' }, { status: 400 }); }
  const input = validateGuidanceRequest(body);
  if (!input) return Response.json({ error: 'Valid location, language, phase, and household details are required.' }, { status: 400 });

  try {
    const weather = await getDashboardData({ latitude: input.latitude, longitude: input.longitude, label: input.locationLabel });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: buildGuidancePrompt(input, weather) }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json', responseSchema: guidanceResponseSchema },
      }),
    });
    if (!response.ok) throw new Error('Gemini request failed');
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned no guidance');
    const guidance: unknown = JSON.parse(text);
    if (!isAiGuidance(guidance)) throw new Error('Gemini returned an invalid structure');
    return Response.json({ guidance, generatedAt: new Date().toISOString(), model });
  } catch {
    return Response.json({ error: 'AI guidance is temporarily unavailable. Use official local advisories for urgent decisions.' }, { status: 502 });
  }
}
