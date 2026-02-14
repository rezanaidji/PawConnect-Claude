import type { ROIInputs, ROIResults } from '../types/landing';

const OWNER_HOURLY_VALUE = 75; // Proxy for high-earning tech professional's time
const WORRY_REDUCTION = 0.7; // 70% reduction in worry
const RESEARCH_REDUCTION = 0.5; // 50% reduction in research time
const FAILED_SPEND_REDUCTION = 0.8; // 80% of failed spend is avoided
const INCIDENT_COST = 200; // Estimated cost per incident
const INCIDENT_REDUCTION = 0.6; // 60% of incidents avoided

export function calculateEmotionalROI(inputs: ROIInputs): ROIResults {
  const { worryHours, failedSpend, incidents, researchHours } = inputs;

  // Calculate time saved
  const worrySavedHours = worryHours * 52 * WORRY_REDUCTION;
  const researchSavedHours = researchHours * 52 * RESEARCH_REDUCTION;
  const timeSavedHours = worrySavedHours + researchSavedHours;
  const timeSavedValue = timeSavedHours * OWNER_HOURLY_VALUE;

  // Calculate avoided costs
  const avoidedCost = failedSpend * FAILED_SPEND_REDUCTION;

  // Calculate avoided incident costs
  const annualIncidentCost = incidents * 12 * INCIDENT_COST;
  const avoidedIncidentCost = annualIncidentCost * INCIDENT_REDUCTION;

  // Total value
  const totalValue = timeSavedValue + avoidedCost + avoidedIncidentCost;

  return {
    totalValue: Math.round(totalValue),
    timeSavedValue: Math.round(timeSavedValue),
    avoidedCost: Math.round(avoidedCost),
    avoidedIncidentCost: Math.round(avoidedIncidentCost),
    timeSavedHours: Math.round(timeSavedHours),
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
