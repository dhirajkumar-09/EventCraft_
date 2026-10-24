import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchServerStatusApi,
  generateEventPlanApi,
  regenerateSectionApi,
  chatWithPlannerApi
} from '../../../src/services/apiService.js';
import { mockPlanFixture, mockMetaFixture } from '../../fixtures/mockPlan.js';

describe('apiService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('fetchServerStatusApi', () => {
    it('returns server status when fetch succeeds', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'online', appName: 'EventCraft AI' })
      });

      const data = await fetchServerStatusApi();
      expect(data.status).toBe('online');
      expect(global.fetch).toHaveBeenCalledWith('/api/status');
    });

    it('throws error when server responds with non-ok HTTP status', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(fetchServerStatusApi()).rejects.toThrow('Server returned HTTP 500');
    });
  });

  describe('generateEventPlanApi', () => {
    it('sends POST request and returns plan data when successful', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, plan: mockPlanFixture, meta: mockMetaFixture })
      });

      const result = await generateEventPlanApi(mockMetaFixture, 'test-key');
      expect(result.success).toBe(true);
      expect(result.plan).toEqual(mockPlanFixture);
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/plan/generate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...mockMetaFixture, apiKey: 'test-key' })
        })
      );
    });

    it('throws error when API returns success: false or error message', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, error: 'City is required' })
      });

      await expect(generateEventPlanApi(mockMetaFixture)).rejects.toThrow('City is required');
    });
  });

  describe('regenerateSectionApi', () => {
    it('sends POST request to regenerate single section and returns section data', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockPlanFixture.budget })
      });

      const result = await regenerateSectionApi('budget', mockPlanFixture, mockMetaFixture);
      expect(result).toEqual(mockPlanFixture.budget);
    });

    it('throws error when section regeneration fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid section' })
      });

      await expect(regenerateSectionApi('invalid', mockPlanFixture, mockMetaFixture)).rejects.toThrow('Invalid section');
    });
  });

  describe('chatWithPlannerApi', () => {
    it('sends user message and chat history to /api/plan/chat', async () => {
      const mockReply = {
        success: true,
        replyMessage: 'Plan adjusted!',
        updatedPlan: mockPlanFixture
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReply
      });

      const history = [{ role: 'user', text: 'Hi' }];
      const result = await chatWithPlannerApi('Cut budget', mockPlanFixture, history, mockMetaFixture);
      expect(result.replyMessage).toBe('Plan adjusted!');
      expect(result.updatedPlan).toEqual(mockPlanFixture);
    });

    it('throws error when chat request fails', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Message cannot be empty' })
      });

      await expect(chatWithPlannerApi('', mockPlanFixture, [])).rejects.toThrow('Message cannot be empty');
    });
  });
});
