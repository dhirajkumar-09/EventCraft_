import { describe, it, expect, vi } from 'vitest';
import { generateWhatsAppSummary, openWhatsAppShare } from '../../../src/utils/whatsappFormat.js';
import { mockPlanFixture, mockMetaFixture } from '../../fixtures/mockPlan.js';

describe('whatsappFormat Utility', () => {
  it('returns empty string if plan is null or undefined', () => {
    expect(generateWhatsAppSummary(null)).toBe('');
    expect(generateWhatsAppSummary(undefined)).toBe('');
  });

  it('formats full event plan into clean WhatsApp markdown text with emojis and bold tags', () => {
    const text = generateWhatsAppSummary(mockPlanFixture, mockMetaFixture);

    expect(text).toContain('✨ *EVENT PLAN: Royal Rajputana Heritage Vivah* ✨');
    expect(text).toContain('*Type:* Wedding');
    expect(text).toContain('*City:* Jaipur');
    expect(text).toContain('*TOTAL BUDGET:* ₹ 15,00,000');
    expect(text).toContain('Venue & Infrastructure:* ₹3,60,000');
    expect(text).toContain('🌟 *TOP WOW MOMENTS:*');
    expect(text).toContain('Cold-Pyro Entry Portal');
    expect(text).toContain('🛡️ *KEY BACKUP PLAN:*');
    expect(text).toContain('Organized with EventCraft AI');
  });

  it('handles plan without meta parameters by falling back to overview defaults', () => {
    const text = generateWhatsAppSummary(mockPlanFixture);
    expect(text).toContain('✨ *EVENT PLAN: Royal Rajputana Heritage Vivah* ✨');
    expect(text).toContain('*Type:* Special Event');
    expect(text).toContain('*City:* City');
  });

  it('opens WhatsApp share URL in a new window', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
    openWhatsAppShare('Hello Wedding');
    expect(openSpy).toHaveBeenCalledWith(
      'https://api.whatsapp.com/send?text=Hello%20Wedding',
      '_blank'
    );
  });
});
