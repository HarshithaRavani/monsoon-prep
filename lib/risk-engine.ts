import type { EmergencyKit, HouseholdRiskScore, RiskLevel } from '../types/monsoon';

export type RiskInputs = {
  precipitation: number;
  rainProbability: number;
  windSpeed: number;
  weatherCode: number;
  location: string;
};

export function severityForScore(score: number): RiskLevel {
  if (score >= 80) return 'Severe';
  if (score >= 60) return 'High';
  if (score >= 35) return 'Moderate';
  return 'Low';
}

export function calculateRiskScore({ precipitation, rainProbability, windSpeed, weatherCode }: RiskInputs) {
  const rawScore = precipitation * 7 + rainProbability * 0.45 + windSpeed * 0.7 + (weatherCode >= 95 ? 25 : 0);
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function buildRiskAssessment(inputs: RiskInputs): { risk: HouseholdRiskScore; kit: EmergencyKit } {
  const score = calculateRiskScore(inputs);
  const level = severityForScore(score);
  const wetConditions = inputs.precipitation >= 5 || inputs.rainProbability >= 60;
  const priorityActions = [
    ...(wetConditions ? ['Avoid waterlogged routes and monitor official local alerts'] : []),
    ...(inputs.windSpeed >= 35 ? ['Secure loose outdoor objects and stay clear of trees'] : []),
    ...(inputs.weatherCode >= 95 ? ['Move indoors and avoid exposed areas during thunderstorms'] : []),
    'Keep phones charged and emergency contacts available',
  ];
  const supplies = [
    'Drinking water', 'Essential medicines', 'Phone charger', 'Flashlight', 'Copies of documents',
    ...(inputs.precipitation >= 5 ? ['Waterproof bags', 'Rain protection'] : []),
  ];

  return {
    risk: {
      score,
      level,
      explanation: `Calculated from current precipitation, forecast rain probability, wind speed, and weather code for ${inputs.location}.`,
      preparednessLevel: score >= 70 ? 'Action needed' : score >= 35 ? 'Review recommended' : 'Routine readiness',
      priorityActions,
      evacuationReadiness: score >= 70 ? 'Review official evacuation guidance' : 'No weather-triggered evacuation signal',
      recommendedSupplies: supplies,
    },
    kit: { title: `Suggested kit for ${inputs.location}`, items: supplies },
  };
}
