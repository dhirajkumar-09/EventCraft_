import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../server.js';

test('API Integration - GET /api/health returns HTTP 200 with ok status', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.ok(res.body.timestamp);
});

test('API Integration - GET /api/status returns HTTP 200 and model details', async () => {
  const res = await request(app).get('/api/status');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'online');
  assert.equal(res.body.appName, 'EventCraft AI');
  assert.ok(res.body.model);
  assert.ok('apiKeyConfigured' in res.body);
  assert.ok('mode' in res.body);
});

test('API Integration - POST /api/plan/generate creates full master plan matching schema', async () => {
  const payload = {
    eventType: 'Wedding',
    eventDate: '2026-11-20',
    city: 'Jaipur',
    venueType: 'palace',
    guestCount: 200,
    totalBudget: 1500000,
    currency: 'INR',
    currencySymbol: '₹',
    cuisineDiet: 'veg'
  };

  const res = await request(app)
    .post('/api/plan/generate')
    .send(payload)
    .set('Content-Type', 'application/json');

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.plan.overview);
  assert.ok(res.body.plan.budget);
  assert.ok(res.body.plan.timeline);
  assert.ok(res.body.plan.vendorChecklist);
  assert.ok(res.body.plan.personalizedIdeas);
  assert.ok(res.body.plan.runSheet);
  assert.ok(res.body.plan.backupPlan);

  // Assert exact budget matching
  const sum = res.body.plan.budget.categories.reduce((acc, c) => acc + c.amount, 0);
  assert.equal(sum, 1500000);
});

test('API Integration - POST /api/plan/regenerate-section updates only targeted section', async () => {
  // First generate plan
  const genRes = await request(app)
    .post('/api/plan/generate')
    .send({
      eventType: 'Birthday',
      city: 'Mumbai',
      totalBudget: 300000,
      currency: 'INR',
      currencySymbol: '₹',
      guestCount: 50,
      venueType: 'indoor',
      cuisineDiet: 'mixed'
    });

  const plan = genRes.body.plan;

  const regenRes = await request(app)
    .post('/api/plan/regenerate-section')
    .send({
      section: 'personalizedIdeas',
      currentPlan: plan,
      eventType: 'Birthday',
      city: 'Mumbai',
      totalBudget: 300000,
      currency: 'INR',
      currencySymbol: '₹',
      guestCount: 50
    });

  assert.equal(regenRes.status, 200);
  assert.equal(regenRes.body.success, true);
  assert.equal(regenRes.body.section, 'personalizedIdeas');
  assert.ok(regenRes.body.data.wowMoments);
  assert.ok(regenRes.body.data.menu);
});

test('API Integration - POST /api/plan/chat updates plan and returns conversational advice', async () => {
  const genRes = await request(app)
    .post('/api/plan/generate')
    .send({
      eventType: 'Wedding',
      city: 'Jaipur',
      totalBudget: 1000000,
      currency: 'INR',
      currencySymbol: '₹',
      guestCount: 150,
      venueType: 'banquet',
      cuisineDiet: 'veg'
    });

  const plan = genRes.body.plan;

  const chatRes = await request(app)
    .post('/api/plan/chat')
    .send({
      message: 'Can we reduce total budget by 20%?',
      currentPlan: plan,
      chatHistory: [],
      eventType: 'Wedding',
      city: 'Jaipur',
      totalBudget: 1000000
    });

  assert.equal(chatRes.status, 200);
  assert.equal(chatRes.body.success, true);
  assert.ok(chatRes.body.replyMessage);
  assert.equal(chatRes.body.updatedPlan.budget.totalBudget, 800000);
});

test('API Integration - Returns HTTP 404 for unknown endpoints', async () => {
  const res = await request(app).get('/api/unknown-route');
  assert.equal(res.status, 404);
  assert.equal(res.body.error, 'Endpoint not found');
});
