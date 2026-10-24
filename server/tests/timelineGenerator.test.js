import test from 'node:test';
import assert from 'node:assert/strict';
import { generateAdaptiveTimeline } from '../services/timelineGenerator.js';

test('Timeline Generator - Returns 6 comprehensive milestone phases when > 60 days remaining', () => {
  const timeline = generateAdaptiveTimeline(90, 'Wedding');
  assert.equal(timeline.length, 6);
  assert.equal(timeline[0].phase, 'Foundation & Vision');
  assert.equal(timeline[0].timeframe, 'T-90 to T-60 Days');
  assert.ok(timeline[0].tasks.length > 0);

  // Wedding-specific task
  const rehearsalTask = timeline[2].tasks.find((t) => t.id === 'tk-8');
  assert.ok(rehearsalTask.title.includes('Sangeet'));
});

test('Timeline Generator - Returns customized non-wedding tasks when event is not a wedding', () => {
  const timeline = generateAdaptiveTimeline(75, 'Corporate Gala');
  assert.equal(timeline.length, 6);
  const rehearsalTask = timeline[2].tasks.find((t) => t.id === 'tk-8');
  assert.ok(rehearsalTask.title.includes('Entertainment & Speeches Rehearsal'));
});

test('Timeline Generator - Returns rapid milestone phases when <= 60 days remaining', () => {
  const timeline = generateAdaptiveTimeline(40, 'Birthday');
  assert.equal(timeline.length, 6);
  assert.equal(timeline[0].phase, 'Urgent Foundations');
  assert.equal(timeline[0].timeframe, 'Next 48 Hours');
  assert.equal(timeline[1].phase, 'Fast-Track Vendors');
  assert.equal(timeline[4].phase, 'Celebration Day');
  assert.equal(timeline[5].phase, 'Post-Event Wrap Up');
});
