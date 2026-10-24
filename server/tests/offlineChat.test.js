import test from 'node:test';
import assert from 'node:assert/strict';
import { handleOfflineChat } from '../services/offlineChatService.js';
import { generateMockEventPlan } from '../services/mockPlanService.js';

test('Offline Chat - Reduces budget by 20% and retains 100% mathematical integrity', () => {
  const initialInput = {
    eventType: 'Wedding',
    totalBudget: 1000000,
    currency: 'INR',
    currencySymbol: '₹',
    city: 'Jaipur'
  };
  const currentPlan = generateMockEventPlan(initialInput);

  const result = handleOfflineChat('Please reduce the budget by 20%', currentPlan, initialInput);

  assert.ok(result.replyMessage.includes('20%'));
  assert.equal(result.updatedPlan.budget.totalBudget, 800000);

  const sum = result.updatedPlan.budget.categories.reduce((acc, c) => acc + c.amount, 0);
  assert.equal(sum, 800000);
});

test('Offline Chat - Incorporates kid-friendly activities and special treats menu', () => {
  const initialInput = {
    eventType: 'Birthday',
    totalBudget: 200000,
    currency: 'INR',
    currencySymbol: '₹',
    city: 'Mumbai'
  };
  const currentPlan = generateMockEventPlan(initialInput);

  const result = handleOfflineChat(
    'We have 15 children attending, add kid friendly games',
    currentPlan,
    initialInput
  );

  assert.ok(result.replyMessage.includes('Kids Fun Zone'));
  const hasKidGame = result.updatedPlan.personalizedIdeas.gamesOrActivities.some((g) =>
    g.includes('Kids Fun Zone')
  );
  assert.ok(hasKidGame);
});

test('Offline Chat - Appends tailored musical playlist segment', () => {
  const initialInput = {
    eventType: 'Anniversary',
    totalBudget: 500000,
    currency: 'INR',
    currencySymbol: '₹',
    city: 'Goa'
  };
  const currentPlan = generateMockEventPlan(initialInput);

  const result = handleOfflineChat(
    'Amp up the dance music and DJ playlist',
    currentPlan,
    initialInput
  );

  assert.ok(result.replyMessage.includes('playlist segment'));
  const hasMusic = result.updatedPlan.personalizedIdeas.music.some((m) =>
    m.includes('Special Request Segment')
  );
  assert.ok(hasMusic);
});

test('Offline Chat - Handles generic modification request reassuringly', () => {
  const initialInput = { eventType: 'Gala', totalBudget: 300000, city: 'Delhi' };
  const currentPlan = generateMockEventPlan(initialInput);

  const result = handleOfflineChat(
    'Focus on sustainable zero-waste decor',
    currentPlan,
    initialInput
  );

  assert.ok(result.replyMessage.includes('sustainable zero-waste decor'));
  assert.ok(result.updatedPlan);
});
