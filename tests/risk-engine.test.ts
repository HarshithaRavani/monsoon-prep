import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRiskAssessment, calculateRiskScore, severityForScore } from '../lib/risk-engine';

const baseline = { precipitation: 0, rainProbability: 0, windSpeed: 0, weatherCode: 0, location: 'Test City' };

test('risk score is zero for calm conditions', () => assert.equal(calculateRiskScore(baseline), 0));
test('risk score is capped at 100', () => assert.equal(calculateRiskScore({ ...baseline, precipitation: 100, rainProbability: 100, windSpeed: 150, weatherCode: 99 }), 100));
test('risk score never falls below zero', () => assert.equal(calculateRiskScore({ ...baseline, precipitation: -5, rainProbability: -10, windSpeed: -20 }), 0));

test('severity boundaries are classified consistently', () => {
  assert.equal(severityForScore(0), 'Low');
  assert.equal(severityForScore(35), 'Moderate');
  assert.equal(severityForScore(60), 'High');
  assert.equal(severityForScore(80), 'Severe');
});

test('heavy rainfall adds flood actions and waterproof supplies', () => {
  const { risk, kit } = buildRiskAssessment({ ...baseline, precipitation: 8, rainProbability: 80 });
  assert.ok(risk.priorityActions.some((action) => action.includes('waterlogged')));
  assert.ok(kit.items.includes('Waterproof bags'));
  assert.ok(kit.items.includes('Rain protection'));
});

test('strong wind adds an outdoor-object warning', () => {
  const { risk } = buildRiskAssessment({ ...baseline, windSpeed: 35 });
  assert.ok(risk.priorityActions.some((action) => action.includes('outdoor objects')));
});

test('thunderstorms add indoor safety guidance', () => {
  const { risk } = buildRiskAssessment({ ...baseline, weatherCode: 95 });
  assert.ok(risk.priorityActions.some((action) => action.includes('Move indoors')));
});

test('location is included in transparent explanations and kit titles', () => {
  const { risk, kit } = buildRiskAssessment({ ...baseline, location: 'Bengaluru, India' });
  assert.match(risk.explanation, /Bengaluru, India/);
  assert.match(kit.title, /Bengaluru, India/);
});
