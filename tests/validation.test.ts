import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCoordinateLabel, isValidCoordinates, normalizeLocationQuery } from '../lib/validation';

test('accepts valid coordinate boundaries', () => {
  assert.equal(isValidCoordinates(-90, -180), true);
  assert.equal(isValidCoordinates(90, 180), true);
  assert.equal(isValidCoordinates(12.9716, 77.5946), true);
});

test('rejects invalid, infinite, and missing coordinates', () => {
  assert.equal(isValidCoordinates(91, 0), false);
  assert.equal(isValidCoordinates(0, 181), false);
  assert.equal(isValidCoordinates(Number.NaN, 0), false);
  assert.equal(isValidCoordinates(0, Number.POSITIVE_INFINITY), false);
});

test('normalizes valid location searches', () => assert.equal(normalizeLocationQuery('  Bengaluru  '), 'Bengaluru'));

test('rejects short and oversized location searches', () => {
  assert.equal(normalizeLocationQuery('a'), null);
  assert.equal(normalizeLocationQuery('x'.repeat(101)), null);
  assert.equal(normalizeLocationQuery(null), null);
});

test('prefers a supplied label and otherwise formats coordinates', () => {
  assert.equal(formatCoordinateLabel(12.9716, 77.5946, ' Bengaluru '), 'Bengaluru');
  assert.equal(formatCoordinateLabel(12.9716, 77.5946), '12.972°, 77.595°');
});
