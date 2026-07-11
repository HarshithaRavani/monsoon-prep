import type { DashboardData, WeatherBriefing } from '@/types/monsoon';
import { buildRiskAssessment } from '@/lib/risk-engine';
import { formatCoordinateLabel } from '@/lib/validation';

type LocationInput = { latitude: number; longitude: number; label?: string };

type OpenMeteoResponse = {
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    apparent_temperature?: number;
    precipitation?: number;
    weather_code?: number;
    surface_pressure?: number;
    wind_speed_10m?: number;
    wind_gusts_10m?: number;
  };
  hourly?: { precipitation_probability?: number[] };
};

const weatherDescriptions: Record<number, string> = {
  0: 'clear skies', 1: 'mainly clear skies', 2: 'partly cloudy conditions', 3: 'overcast conditions',
  45: 'fog', 48: 'freezing fog', 51: 'light drizzle', 53: 'drizzle', 55: 'heavy drizzle',
  61: 'light rain', 63: 'rain', 65: 'heavy rain', 71: 'light snow', 73: 'snow', 75: 'heavy snow',
  80: 'light rain showers', 81: 'rain showers', 82: 'violent rain showers', 95: 'thunderstorms',
  96: 'thunderstorms with hail', 99: 'severe thunderstorms with hail',
};

export async function getDashboardData(location: LocationInput): Promise<DashboardData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_gusts_10m',
    hourly: 'precipitation_probability',
    forecast_days: '1',
    timezone: 'auto',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Weather provider returned ${response.status}`);

  const data = (await response.json()) as OpenMeteoResponse;
  const current = data.current;
  if (!current || current.temperature_2m == null || current.precipitation == null) {
    throw new Error('Weather provider returned incomplete conditions');
  }

  const chance = data.hourly?.precipitation_probability?.[0] ?? 0;
  const rain = current.precipitation;
  const wind = current.wind_speed_10m ?? 0;
  const code = current.weather_code ?? 0;
  const place = formatCoordinateLabel(location.latitude, location.longitude, location.label);
  const { risk, kit } = buildRiskAssessment({ precipitation: rain, rainProbability: chance, windSpeed: wind, weatherCode: code, location: place });

  const briefing: WeatherBriefing = {
    title: 'Current weather conditions',
    summary: `${place} currently has ${weatherDescriptions[code] ?? 'reported weather conditions'}, ${current.temperature_2m}°C, ${rain} mm precipitation, and a ${chance}% forecast rain probability.`,
    riskLevel: risk.level,
    nextAction: risk.priorityActions[0],
    location: place,
    temperature: `${current.temperature_2m}°C`,
    metrics: [
      { label: 'Feels like', value: `${current.apparent_temperature ?? current.temperature_2m}°C`, icon: '🌡️' },
      { label: 'Humidity', value: `${current.relative_humidity_2m ?? '—'}%`, icon: '💧' },
      { label: 'Precipitation', value: `${rain} mm`, icon: '🌧️' },
      { label: 'Rain probability', value: `${chance}%`, icon: '☔' },
      { label: 'Wind', value: `${wind} km/h`, icon: '💨' },
      { label: 'Wind gusts', value: `${current.wind_gusts_10m ?? '—'} km/h`, icon: '🍃' },
      { label: 'Pressure', value: `${current.surface_pressure ?? '—'} hPa`, icon: '🧭' },
    ],
    observedAt: current.time ?? new Date().toISOString(),
    source: 'Open-Meteo forecast API',
  };

  return { briefing, risk, kit };
}
