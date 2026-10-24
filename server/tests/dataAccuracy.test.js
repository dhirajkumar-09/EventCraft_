import test from 'node:test';
import assert from 'node:assert/strict';
import { generateMockEventPlan } from '../services/mockPlanService.js';

test('Data Accuracy - Verifies completeness and mathematical correctness across all 7 sections', () => {
  const input = {
    eventType: 'Wedding',
    eventDate: '2026-12-15',
    city: 'Jaipur',
    venueType: 'banquet',
    guestCount: 250,
    totalBudget: 1500000,
    currency: 'INR',
    currencySymbol: '₹',
    cuisineDiet: 'veg',
    themePreference: 'Royal Rajputana Heritage',
    traditions: 'North Indian Vivah',
    ageGroup: 'Multi-generational',
    specialRequests: 'Sitar welcome, live jalebi counter'
  };

  const plan = generateMockEventPlan(input);

  // Section 1: Overview
  assert.ok(plan.overview, 'Overview must exist');
  assert.ok(plan.overview.suggestedTheme.length > 5, 'Theme must be non-empty and descriptive');
  assert.ok(plan.overview.oneLineVibe.length > 5, 'Vibe must be non-empty');
  assert.ok(plan.overview.summary.length > 20, 'Summary must be comprehensive');
  assert.equal(plan.overview.colorPalette.length, 5, 'Must have 5 palette colors');
  plan.overview.colorPalette.forEach(c => {
    assert.ok(c.name && c.hex && c.hex.startsWith('#'), 'Palette colors must have name and hex');
  });

  // Section 2: Budget
  assert.ok(plan.budget, 'Budget must exist');
  assert.equal(plan.budget.totalBudget, input.totalBudget);
  assert.equal(plan.budget.categories.length, 9, 'Must have exactly 9 core categories');
  const sum = plan.budget.categories.reduce((acc, c) => acc + c.amount, 0);
  assert.equal(sum, input.totalBudget, `Budget sum (${sum}) must strictly equal totalBudget (${input.totalBudget})`);
  const contingency = plan.budget.categories.find(c => c.category.toLowerCase().includes('contingency'));
  assert.ok(contingency, 'Must have 10% contingency');
  assert.equal(contingency.percentage, 10);
  assert.equal(plan.budget.moneySavingTips.length, 3, 'Must have exactly 3 money-saving tips');

  // Section 3: Timeline
  assert.ok(Array.isArray(plan.timeline), 'Timeline must be an array');
  assert.ok(plan.timeline.length >= 5, 'Timeline must have multiple milestone phases');
  plan.timeline.forEach(phase => {
    assert.ok(phase.phase && phase.timeframe, 'Phase must have name and timeframe');
    assert.ok(Array.isArray(phase.tasks) && phase.tasks.length > 0, 'Phase must have tasks');
    phase.tasks.forEach(t => {
      assert.ok(t.id && t.title && t.description && t.priority, 'Task must have id, title, description, and priority');
    });
  });

  // Section 4: Vendor Checklist
  assert.ok(Array.isArray(plan.vendorChecklist), 'Vendor checklist must be an array');
  assert.ok(plan.vendorChecklist.length >= 5, 'Must have at least 5 essential vendors');
  plan.vendorChecklist.forEach(v => {
    assert.ok(v.id && v.vendorType, 'Vendor must have id and type');
    assert.ok(v.whatToAskOrNegotiate.length > 10, 'Must have detailed negotiation question');
    assert.ok(v.estimatedCostRange.length > 3, 'Must have cost range');
    assert.ok(v.bookingDeadline.length > 2, 'Must have booking deadline');
  });

  // Section 5: Personalized Ideas
  assert.ok(plan.personalizedIdeas, 'Personalized ideas must exist');
  assert.equal(plan.personalizedIdeas.wowMoments.length, 3, 'Must have exactly 3 wow moments');
  plan.personalizedIdeas.wowMoments.forEach(w => {
    assert.ok(w.title && w.description && w.executionTip, 'Wow moment must have title, description, and tip');
  });
  assert.ok(Array.isArray(plan.personalizedIdeas.menu) && plan.personalizedIdeas.menu.length >= 3, 'Must have multi-course menu');
  assert.ok(Array.isArray(plan.personalizedIdeas.decor) && plan.personalizedIdeas.decor.length >= 3, 'Must have decor ideas');
  assert.ok(Array.isArray(plan.personalizedIdeas.gamesOrActivities) && plan.personalizedIdeas.gamesOrActivities.length >= 3, 'Must have games');

  // Section 6: Run Sheet
  assert.ok(Array.isArray(plan.runSheet) && plan.runSheet.length >= 6, 'Run sheet must have at least 6 hourly slots');
  plan.runSheet.forEach(r => {
    assert.ok(r.time && r.activity && r.owner && r.notes, 'Run sheet slot must have time, activity, owner, and notes');
  });

  // Section 7: Backup Plan
  assert.ok(Array.isArray(plan.backupPlan) && plan.backupPlan.length === 3, 'Backup plan must have top 3 risks');
  plan.backupPlan.forEach(b => {
    assert.ok(b.risk && b.severity && b.triggerSigns && b.mitigation, 'Backup risk must have scenario, severity, trigger signs, and mitigation');
  });
});
