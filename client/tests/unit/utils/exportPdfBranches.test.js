import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportStructuredPdf, triggerPrintPlan, openPrintableDocument } from '../../../src/utils/exportPdf.js';

describe('exportPdf Branch & Edge Cases', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles print dialog trigger', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    triggerPrintPlan();
    expect(printSpy).toHaveBeenCalled();
  });

  it('openPrintableDocument delegates to exportStructuredPdf', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    openPrintableDocument(null);
    expect(alertMock).toHaveBeenCalledWith('No event plan available to export.');
  });

  it('handles plans with missing overview, empty categories, and USD currency symbol', () => {
    const minimalPlan = {
      overview: null,
      budget: {
        currencySymbol: '$',
        totalBudget: 50000,
        categories: [
          { name: 'Venue', percentage: 50, amount: 25000, note: '' }
        ]
      },
      timeline: [
        {
          phase: 'Phase 1',
          timeframe: 'Month 1',
          tasks: [
            { title: 'Task 1', priority: 'High', description: 'Desc 1' },
            { title: 'Task 2', priority: '', description: 'Desc 2' } // idx > 0 tests idx === 0 ? ... : ''
          ]
        }
      ],
      vendorChecklist: [
        {
          category: 'Venues',
          estimatedCost: '10,000',
          negotiationTip: 'Ask for bundle',
          keyQuestions: ['Available?']
        }
      ],
      personalizedIdeas: {
        wowMoments: [
          { title: 'Drone Show', description: 'Night sky display' }
        ],
        decorAndAtmosphere: ['Fairy lights'],
        menuAndCulinaryExperience: [
          { course: 'Starters', items: ['Bruschetta'] }
        ]
      },
      runSheet: [
        { time: '12:00 PM', activity: 'Arrival', lead: 'Coordinator', notes: 'Gifts table' }
      ],
      backupPlan: [
        { risk: 'Rain', severity: 'High', trigger: 'Overcast', mitigation: 'Indoor hall' }
      ]
    };

    const emptyMeta = {
      city: '',
      eventType: '',
      guestCount: ''
    };

    expect(() => {
      exportStructuredPdf(minimalPlan, emptyMeta);
    }).not.toThrow();
  });

  it('handles plans with completely empty array sections', () => {
    const emptySectionsPlan = {
      overview: {
        suggestedTheme: '',
        oneLineVibe: '',
        colorPalette: []
      },
      budget: {
        currencySymbol: '€',
        totalBudget: 0,
        categories: []
      },
      timeline: [],
      vendorChecklist: [],
      personalizedIdeas: {
        wowMoments: [],
        decorAndAtmosphere: [],
        menuAndCulinaryExperience: []
      },
      runSheet: [],
      backupPlan: []
    };

    expect(() => {
      exportStructuredPdf(emptySectionsPlan, {});
    }).not.toThrow();
  });
});
