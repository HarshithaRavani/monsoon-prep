export type DisasterType = 'flood' | 'cyclone' | 'heatwave' | 'wildfire' | 'earthquake';

export interface WeatherMetric {
  label: string;
  value: string;
  icon: string;
}

export interface WeatherBriefing {
  title: string;
  summary: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  nextAction: string;
  location: string;
  temperature: string;
  humidity: string;
  aqi: string;
  pollen: string;
  uvIndex: string;
  wind: string;
  dewPoint: string;
  pressure: string;
  visibility: string;
  metrics: WeatherMetric[];
}

export interface HouseholdRiskScore {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Severe';
  explanation: string;
  preparednessLevel: string;
  priorityActions: string[];
  evacuationReadiness: string;
  recommendedSupplies: string[];
}

export interface CommunityReport {
  id: string;
  type: string;
  location: string;
  description: string;
  confidence: number;
  timestamp: string;
  verified: boolean;
}

export interface EmergencyKit {
  title: string;
  items: string[];
}

export interface DisasterModuleConfig {
  id: DisasterType;
  label: string;
  description: string;
  strategy: string;
}
