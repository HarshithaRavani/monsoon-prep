export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Severe';

export interface WeatherMetric {
  label: string;
  value: string;
  icon: string;
}

export interface WeatherBriefing {
  title: string;
  summary: string;
  riskLevel: RiskLevel;
  nextAction: string;
  location: string;
  temperature: string;
  metrics: WeatherMetric[];
  observedAt: string;
  source: string;
}

export interface HouseholdRiskScore {
  score: number;
  level: RiskLevel;
  explanation: string;
  preparednessLevel: string;
  priorityActions: string[];
  evacuationReadiness: string;
  recommendedSupplies: string[];
}

export interface EmergencyKit {
  title: string;
  items: string[];
}

export interface DashboardData {
  briefing: WeatherBriefing;
  risk: HouseholdRiskScore;
  kit: EmergencyKit;
}

export interface CommunityReport {
  id: string;
  type: string;
  location: string;
  description: string;
  timestamp: string;
}
