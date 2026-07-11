import type { DisasterModuleConfig } from '@/types/monsoon';

export const disasterModules: DisasterModuleConfig[] = [
  {
    id: 'flood',
    label: 'Flood Response',
    description: 'Localized alerts, route safety, and household readiness.',
    strategy: 'risk-based-evacuation',
  },
  {
    id: 'cyclone',
    label: 'Cyclone readiness',
    description: 'Shelters, power continuity, and clear family check-ins.',
    strategy: 'shelter-first',
  },
  {
    id: 'heatwave',
    label: 'Heatwave care',
    description: 'Hydration, cooling centers, and medical monitoring.',
    strategy: 'cooling-and-monitoring',
  },
  {
    id: 'wildfire',
    label: 'Wildfire planning',
    description: 'Smoke safety, evacuation planning, and air quality alerts.',
    strategy: 'early-evacuation',
  },
  {
    id: 'earthquake',
    label: 'Earthquake response',
    description: 'Drop-cover-hold, safe routes, and post-event triage.',
    strategy: 'safety-and-assembly',
  },
];
