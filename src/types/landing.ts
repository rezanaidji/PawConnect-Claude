export interface ROIInputs {
  worryHours: number;
  failedSpend: number;
  incidents: number;
  researchHours: number;
}

export interface ROIResults {
  totalValue: number;
  timeSavedValue: number;
  avoidedCost: number;
  avoidedIncidentCost: number;
  timeSavedHours: number;
}

export interface Feature {
  id: string;
  name: string;
  title: string;
  description: string;
  metric: string;
  metricValue: string;
  icon: 'collar' | 'glasses' | 'network';
}

export interface ProblemCard {
  id: string;
  headline: string;
  description: string;
  statValue: string;
  statDescription: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  avatar?: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface PricingTier {
  name: string;
  hardwarePrice: string;
  monthlyPrice: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}
