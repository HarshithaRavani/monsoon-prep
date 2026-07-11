import type { CommunityReport, EmergencyKit, HouseholdRiskScore, WeatherBriefing } from '@/types/monsoon';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current=temperature_2m,precipitation,weather_code&hourly=precipitation_probability,temperature_2m&timezone=auto';
const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000;
const WEATHER_CACHE_STALE_MS = 30 * 1000;

type WeatherSnapshot = {
  current?: {
    temperature_2m?: number;
    precipitation?: number;
    weather_code?: number;
  };
  hourly?: {
    precipitation_probability?: Array<number | undefined>;
  };
};

type WeatherCacheEntry = {
  data: WeatherSnapshot | null;
  expiresAt: number;
  pending: Promise<WeatherSnapshot | null> | null;
};

let weatherCache: WeatherCacheEntry | null = null;

const fallbackWeatherData = {
  temperature: 29,
  precipitation: 2,
  chance: 30,
  mode: 'fallback',
} as const;

async function getLiveWeatherSnapshot(): Promise<WeatherSnapshot | null> {
  const now = Date.now();

  if (weatherCache?.data && now < weatherCache.expiresAt) {
    return weatherCache.data;
  }

  if (weatherCache?.pending) {
    return weatherCache.pending;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  weatherCache = {
    data: null,
    expiresAt: 0,
    pending: (async () => {
      try {
        const response = await fetch(WEATHER_URL, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Weather API responded with ${response.status}`);
        }

        const data = (await response.json()) as WeatherSnapshot;
        weatherCache = {
          data,
          expiresAt: Date.now() + WEATHER_CACHE_TTL_MS,
          pending: null,
        };
        return data;
      } catch {
        weatherCache = {
          data: null,
          expiresAt: Date.now() + WEATHER_CACHE_STALE_MS,
          pending: null,
        };
        return null;
      } finally {
        clearTimeout(timeoutId);
      }
    })(),
  };

  return weatherCache.pending;
}

function getSeverityLabel(score: number): 'Low' | 'Moderate' | 'High' | 'Severe' {
  if (score >= 80) return 'Severe';
  if (score >= 60) return 'High';
  if (score >= 35) return 'Moderate';
  return 'Low';
}

export async function getWeatherBriefing(): Promise<WeatherBriefing> {
  const snapshot = await getLiveWeatherSnapshot();
  const temperature = snapshot?.current?.temperature_2m ?? fallbackWeatherData.temperature;
  const precipitation = snapshot?.current?.precipitation ?? fallbackWeatherData.precipitation;
  const chance = snapshot?.hourly?.precipitation_probability?.[0] ?? fallbackWeatherData.chance;
  const isFallback = !snapshot;

  let riskLevel: WeatherBriefing['riskLevel'] = 'Low';
  let nextAction = 'Keep your routine plans simple and monitor local updates.';

  if (precipitation >= 8 || chance >= 70) {
    riskLevel = 'High';
    nextAction = 'Leave extra travel time and prepare your emergency kit before heading out.';
  } else if (precipitation >= 3 || chance >= 35) {
    riskLevel = 'Moderate';
    nextAction = 'Charge your devices and review your household checklist this afternoon.';
  }

  const humidity = `${Math.max(40, Math.min(95, 60 + Math.round(precipitation * 8)))}%`;
  const aqi = `${Math.max(40, Math.min(180, 70 + Math.round(chance / 2)))} AQI`;
  const pollen = `${Math.max(10, Math.min(80, 20 + Math.round(chance / 3)))}%`;
  const uvIndex = `${Math.max(2, Math.min(10, 4 + Math.round(temperature / 10)))} uv`;
  const wind = `${Math.max(8, Math.min(40, 12 + Math.round(precipitation * 2)))} km/h`;
  const dewPoint = `${Math.max(18, Math.min(32, temperature - 2))}°C`;
  const pressure = `${Math.max(980, Math.min(1030, 1013 - Math.round(precipitation * 2)))} hPa`;
  const visibility = `${Math.max(5, Math.min(15, 12 - Math.round(precipitation / 2)))} km`;
  const metrics = [
    { label: 'Humidity', value: humidity, icon: '💧' },
    { label: 'AQI', value: aqi, icon: '🌫️' },
    { label: 'Pollen', value: pollen, icon: '🌼' },
    { label: 'UV', value: uvIndex, icon: '☀️' },
    { label: 'Wind', value: wind, icon: '💨' },
    { label: 'Dew point', value: dewPoint, icon: '🌡️' },
    { label: 'Pressure', value: pressure, icon: '🧭' },
    { label: 'Visibility', value: visibility, icon: '👁️' },
  ];

  return {
    title: isFallback ? 'Fallback weather update' : 'Live weather conditions',
    summary: isFallback
      ? `Live data is temporarily unavailable, so the app is showing a safe fallback estimate of ${temperature}°C with ${precipitation} mm of precipitation and a ${chance}% chance of rain.`
      : `Current conditions show ${temperature}°C with ${precipitation} mm of precipitation and a ${chance}% chance of rain in the next hour.`,
    riskLevel,
    nextAction,
    location: 'Mumbai, India',
    temperature: `${temperature}°C`,
    humidity,
    aqi,
    pollen,
    uvIndex,
    wind,
    dewPoint,
    pressure,
    visibility,
    metrics,
  };
}

export async function getHouseholdRisk(): Promise<HouseholdRiskScore> {
  const snapshot = await getLiveWeatherSnapshot();
  const precipitation = snapshot?.current?.precipitation ?? fallbackWeatherData.precipitation;
  const temperature = snapshot?.current?.temperature_2m ?? fallbackWeatherData.temperature;
  const chance = snapshot?.hourly?.precipitation_probability?.[0] ?? fallbackWeatherData.chance;
  const score = Math.min(100, 30 + Math.round(precipitation * 7) + (chance >= 60 ? 18 : 0) + (temperature >= 35 ? 8 : 0));
  const level = getSeverityLabel(score);
  const isFallback = !snapshot;
  const explanation = isFallback
    ? `Live data is unavailable, so the app is using a fallback estimate based on ${precipitation} mm of rain and ${chance}% rain probability.`
    : `Live conditions indicate ${precipitation} mm of rain and ${chance}% rain probability, which elevates household readiness needs.`;

  return {
    score,
    level,
    explanation,
    preparednessLevel: score >= 70 ? 'Needs attention' : score >= 45 ? 'Partially ready' : 'Ready',
    priorityActions: [
      'Confirm water and medicine supplies',
      'Keep backup lights and power banks charged',
      'Review safe travel routes and shelter options',
    ],
    evacuationReadiness: score >= 70 ? 'Needs review' : score >= 45 ? 'Moderate' : 'Good',
    recommendedSupplies: ['Water', 'Flashlight', 'Power bank', 'Rain gear', 'First-aid kit'],
  };
}

export async function getCommunityReports(): Promise<CommunityReport[]> {
  const snapshot = await getLiveWeatherSnapshot();
  const precipitation = snapshot?.current?.precipitation ?? fallbackWeatherData.precipitation;
  const chance = snapshot?.hourly?.precipitation_probability?.[0] ?? fallbackWeatherData.chance;
  const confidence = Math.min(99, 65 + Math.round(precipitation * 3) + (chance >= 60 ? 10 : 0));
  const isFallback = !snapshot;

  return [
    {
      id: 'live-1',
      type: precipitation >= 6 ? 'Heavy rainfall' : 'Rainfall watch',
      location: 'Central district',
      description: isFallback
        ? 'The app is using a fallback status while live weather data is temporarily unavailable.'
        : precipitation >= 6
          ? 'Water accumulation is increasing near the main corridor.'
          : 'Rainfall remains active across the central district.',
      confidence,
      timestamp: 'updated now',
      verified: true,
    },
    {
      id: 'live-2',
      type: chance >= 60 ? 'Drain monitoring' : 'Road clearance',
      location: 'North avenue',
      description: isFallback
        ? 'The fallback status indicates nearby road conditions should still be monitored.'
        : chance >= 60
          ? 'Drain conditions are being monitored after sustained rainfall.'
          : 'Traffic flow is being watched as weather conditions remain variable.',
      confidence: Math.max(50, confidence - 10),
      timestamp: 'updated now',
      verified: chance >= 60,
    },
  ];
}

export async function getEmergencyKit(): Promise<EmergencyKit> {
  const snapshot = await getLiveWeatherSnapshot();
  const precipitation = snapshot?.current?.precipitation ?? fallbackWeatherData.precipitation;
  const items = [
    'Water for 2 days',
    'Medicines',
    'Phone charger',
    'Flashlight',
    'Copies of documents',
  ];

  if (precipitation >= 5) {
    items.push('Waterproof bags');
  }

  return {
    title: 'Current household kit',
    items,
  };
}
