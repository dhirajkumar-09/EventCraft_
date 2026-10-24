import test from 'node:test';
import assert from 'node:assert/strict';

test('E2E Full Flow - Generate, Validate, Chat, and Regenerate Section', async () => {
  const baseUrl = 'http://localhost:5000/api';

  // 1. Health check
  const healthRes = await fetch(`${baseUrl}/health`);
  assert.equal(healthRes.status, 200);
  const healthData = await healthRes.json();
  assert.equal(healthData.status, 'ok');

  // 2. Status check
  const statusRes = await fetch(`${baseUrl}/status`);
  assert.equal(statusRes.status, 200);
  const statusData = await statusRes.json();
  assert.equal(statusData.model, 'gemini-2.5-flash');

  // 3. Generate Plan
  const planPayload = {
    eventType: 'Wedding',
    eventDate: '2026-11-20',
    city: 'Jaipur',
    venueType: 'banquet',
    guestCount: 200,
    totalBudget: 1500000,
    currency: 'INR',
    currencySymbol: '₹',
    cuisineDiet: 'veg',
    themePreference: 'Royal Rajputana',
    traditions: 'North Indian Vivah',
    ageGroup: 'All ages',
    specialRequests: 'Sitar welcome, live jalebi station'
  };

  const genRes = await fetch(`${baseUrl}/plan/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planPayload)
  });

  assert.equal(genRes.status, 200);
  const genData = await genRes.json();
  assert.equal(genData.success, true);
  assert.ok(genData.plan);

  const plan = genData.plan;

  // 4. Verify 7 Tabs Structure
  assert.ok(plan.overview, 'Overview section required');
  assert.ok(plan.overview.suggestedTheme);
  assert.ok(plan.overview.oneLineVibe);
  assert.ok(Array.isArray(plan.overview.colorPalette));

  assert.ok(plan.budget, 'Budget section required');
  assert.equal(plan.budget.totalBudget, 1500000);
  assert.equal(plan.budget.categories.length, 9, 'Must have 9 core categories');
  const budgetSum = plan.budget.categories.reduce((acc, c) => acc + c.amount, 0);
  assert.equal(budgetSum, 1500000, 'Sum of categories must strictly equal totalBudget');
  assert.equal(plan.budget.moneySavingTips.length, 3, 'Must have 3 money-saving tips');

  assert.ok(Array.isArray(plan.timeline), 'Timeline required');
  assert.ok(plan.timeline.length >= 5, 'Adaptive timeline milestones required');

  assert.ok(Array.isArray(plan.vendorChecklist), 'Vendor checklist required');
  assert.ok(plan.vendorChecklist.length >= 4);

  assert.ok(plan.personalizedIdeas, 'Personalized ideas required');
  assert.equal(plan.personalizedIdeas.wowMoments.length, 3, 'Must have 3 wow moments');

  assert.ok(Array.isArray(plan.runSheet), 'Run sheet required');
  assert.ok(plan.runSheet.length >= 6);

  assert.ok(Array.isArray(plan.backupPlan), 'Backup plan required');
  assert.equal(plan.backupPlan.length, 3, 'Must have top 3 risks');

  // 5. Regenerate Section
  const regenRes = await fetch(`${baseUrl}/plan/regenerate-section`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      section: 'personalizedIdeas',
      currentPlan: plan,
      ...planPayload
    })
  });
  assert.equal(regenRes.status, 200);
  const regenData = await regenRes.json();
  assert.equal(regenData.success, true);
  assert.equal(regenData.section, 'personalizedIdeas');
  assert.equal(regenData.data.wowMoments.length, 3);

  // 6. Chat with Planner
  const chatRes = await fetch(`${baseUrl}/plan/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Please reduce budget by 20% and make it kid friendly',
      currentPlan: plan,
      ...planPayload
    })
  });
  assert.equal(chatRes.status, 200);
  const chatData = await chatRes.json();
  assert.equal(chatData.success, true);
  assert.ok(chatData.replyMessage);
  assert.ok(chatData.updatedPlan);
  assert.equal(chatData.updatedPlan.budget.totalBudget, 1200000, 'Budget reduced by 20%');
});
