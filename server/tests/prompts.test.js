import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SYSTEM_PROMPT,
  buildMasterPlanPrompt,
  buildRegenerateSectionPrompt,
  buildChatPlannerPrompt
} from '../prompts/eventPlanPrompts.js';

test('Prompts - SYSTEM_PROMPT contains expert guidelines and JSON schema requirement', () => {
  assert.ok(SYSTEM_PROMPT.includes('expert event planner'));
  assert.ok(SYSTEM_PROMPT.includes('return only valid JSON'));
});

test('Prompts - buildMasterPlanPrompt interpolates all celebration parameters strictly', () => {
  const input = {
    eventType: 'Wedding',
    eventDate: '2026-11-20',
    city: 'Jaipur',
    venueType: 'palace',
    guestCount: 250,
    totalBudget: 1500000,
    currency: 'INR',
    currencySymbol: '₹',
    cuisineDiet: 'veg',
    themePreference: 'Royal Rajputana',
    traditions: 'North Indian Vivah',
    ageGroup: 'Multi-generational',
    specialRequests: 'Sitar welcome'
  };

  const prompt = buildMasterPlanPrompt(input);
  assert.ok(prompt.includes('Event Type: Wedding'));
  assert.ok(prompt.includes('City: Jaipur'));
  assert.ok(prompt.includes(`Total Budget: ₹ ${Number(input.totalBudget).toLocaleString()} (INR)`));
  assert.ok(prompt.includes('STRICT REQUIREMENTS:'));
  assert.ok(prompt.includes('1500000'));
});

test('Prompts - buildRegenerateSectionPrompt targets only specified section', () => {
  const currentPlan = { overview: { suggestedTheme: 'Royal Gala' } };
  const input = {
    eventType: 'Anniversary',
    city: 'Goa',
    totalBudget: 500000,
    guestCount: 80,
    currencySymbol: '₹'
  };

  const prompt = buildRegenerateSectionPrompt('budget', currentPlan, input);
  assert.ok(prompt.includes("ONLY the 'budget' section"));
  assert.ok(prompt.includes('Anniversary'));
  assert.ok(prompt.includes('Goa'));
  assert.ok(prompt.includes('Return JSON with key "budget"'));
});

test('Prompts - buildChatPlannerPrompt formats conversation history and user instruction', () => {
  const history = [
    { role: 'user', text: 'Can we reduce budget?' },
    { role: 'assistant', text: 'Sure, I can adjust catering.' }
  ];
  const input = { eventType: 'Birthday', city: 'Mumbai', totalBudget: 300000, currencySymbol: '₹' };

  const prompt = buildChatPlannerPrompt('Make it kid friendly', {}, history, input);
  assert.ok(prompt.includes('User Message: "Make it kid friendly"'));
  assert.ok(prompt.includes('Client: Can we reduce budget?'));
  assert.ok(prompt.includes('Planner: Sure, I can adjust catering.'));
});
