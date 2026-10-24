import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isGeminiConfigured,
  extractAndParseJson,
  generateEventPlan,
  regenerateSection,
  chatWithPlanner
} from '../services/geminiService.js';

test('Gemini Service - isGeminiConfigured returns false for empty or placeholder keys', () => {
  assert.equal(isGeminiConfigured(''), false);
  assert.equal(isGeminiConfigured('   '), false);
  assert.equal(isGeminiConfigured('YOUR_GEMINI_API_KEY_HERE'), false);
  assert.equal(isGeminiConfigured('AIzaSyValidDummyKey123'), true);
});

test('Gemini Service - extractAndParseJson throws on non-string input', () => {
  assert.throws(() => extractAndParseJson(123), /Input to extractAndParseJson must be a string/);
  assert.throws(() => extractAndParseJson(null), /Input to extractAndParseJson must be a string/);
});

test('Gemini Service - Fallback to intelligent planner engine when no API key provided', async () => {
  const input = {
    eventType: 'Birthday',
    city: 'Mumbai',
    totalBudget: 250000,
    guestCount: 50,
    currency: 'INR',
    currencySymbol: '₹',
    cuisineDiet: 'mixed',
    apiKey: ''
  };

  const plan = await generateEventPlan(input);
  assert.ok(plan.overview);
  assert.ok(plan.budget);
  assert.equal(plan.budget.totalBudget, 250000);
});

test('Gemini Service - Regenerate section falls back cleanly without API key', async () => {
  const input = {
    eventType: 'Wedding',
    city: 'Jaipur',
    totalBudget: 1000000,
    guestCount: 150,
    currency: 'INR',
    currencySymbol: '₹',
    cuisineDiet: 'veg',
    apiKey: ''
  };

  const initialPlan = await generateEventPlan(input);
  const updatedBudget = await regenerateSection('budget', initialPlan, input);

  assert.ok(updatedBudget.categories);
  assert.equal(updatedBudget.totalBudget, 1000000);
});

test('Gemini Service - Chat with planner routes to offline planner assistant when no API key', async () => {
  const input = {
    eventType: 'Wedding',
    city: 'Jaipur',
    totalBudget: 1000000,
    currency: 'INR',
    currencySymbol: '₹',
    apiKey: ''
  };

  const initialPlan = await generateEventPlan(input);
  const result = await chatWithPlanner('Can you cut budget by 20%?', initialPlan, [], input);

  assert.ok(result.replyMessage);
  assert.equal(result.updatedPlan.budget.totalBudget, 800000);
});
