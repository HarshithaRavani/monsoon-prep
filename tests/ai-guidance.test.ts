import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGuidancePrompt, isAiGuidance, validateGuidanceRequest } from '../lib/ai-guidance';
import type { DashboardData } from '../types/monsoon';

const validRequest = { latitude: 12.97, longitude: 77.59, locationLabel: 'Bengaluru', language: 'English', phase: 'before', householdProfile: 'Two adults and one child', travelPlans: 'Bus at 6 PM' };

test('accepts a complete supported guidance request', () => assert.ok(validateGuidanceRequest(validRequest)));
test('rejects unsupported languages and phases', () => {
  assert.equal(validateGuidanceRequest({ ...validRequest, language: 'Klingon' }), null);
  assert.equal(validateGuidanceRequest({ ...validRequest, phase: 'whenever' }), null);
});
test('rejects missing household context and oversized inputs', () => {
  assert.equal(validateGuidanceRequest({ ...validRequest, householdProfile: '' }), null);
  assert.equal(validateGuidanceRequest({ ...validRequest, householdProfile: 'x'.repeat(501) }), null);
  assert.equal(validateGuidanceRequest({ ...validRequest, travelPlans: 'x'.repeat(301) }), null);
});
test('rejects invalid coordinates', () => assert.equal(validateGuidanceRequest({ ...validRequest, latitude: 100 }), null));

test('prompt includes live facts, requested language, phase, and injection defense', () => {
  const weather = {
    briefing: { location: 'Bengaluru', observedAt: '2026-07-11T10:00', source: 'Open-Meteo forecast API', summary: 'Heavy rain', metrics: [], title: 'Current weather', riskLevel: 'High', nextAction: 'Stay alert', temperature: '24°C' },
    risk: { score: 70, level: 'High', explanation: 'Weather risk', preparednessLevel: 'Action needed', priorityActions: ['Stay alert'], evacuationReadiness: 'Review guidance', recommendedSupplies: ['Water'] },
    kit: { title: 'Kit', items: ['Water'] },
  } satisfies DashboardData;
  const prompt = buildGuidancePrompt(validRequest as NonNullable<ReturnType<typeof validateGuidanceRequest>>, weather);
  assert.match(prompt, /Bengaluru/);
  assert.match(prompt, /English/);
  assert.match(prompt, /before/);
  assert.match(prompt, /untrusted user data/);
  assert.match(prompt, /Do not invent official alerts/);
});

test('accepts complete structured AI output and rejects incomplete output', () => {
  const output = { headline: 'Prepare now', riskSummary: 'High rain risk', personalizedPlan: ['Charge phones'], emergencyChecklist: ['Pack water'], travelAdvisory: 'Delay travel', safetyRecommendations: ['Stay indoors'], alerts: ['Monitor official alerts'], disclaimer: 'Follow local authorities' };
  assert.equal(isAiGuidance(output), true);
  assert.equal(isAiGuidance({ ...output, emergencyChecklist: [] }), false);
  assert.equal(isAiGuidance({ ...output, travelAdvisory: '' }), false);
});
