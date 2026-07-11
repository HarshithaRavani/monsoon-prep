import { NextRequest } from 'next/server';
import { getDashboardData } from '@/services/monsoonService';
import { isValidCoordinates } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get('latitude'));
  const longitude = Number(request.nextUrl.searchParams.get('longitude'));
  const label = request.nextUrl.searchParams.get('label') ?? undefined;
  if (!isValidCoordinates(latitude, longitude)) {
    return Response.json({ error: 'Valid latitude and longitude are required.' }, { status: 400 });
  }
  try {
    return Response.json(await getDashboardData({ latitude, longitude, label }));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Weather data is unavailable.' }, { status: 502 });
  }
}
