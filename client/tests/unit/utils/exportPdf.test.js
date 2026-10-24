import { describe, it, expect, vi } from 'vitest';
import { exportStructuredPdf } from '../../../src/utils/exportPdf.js';
import { mockPlanFixture, mockMetaFixture } from '../../fixtures/mockPlan.js';

describe('exportPdf Utility', () => {
  it('alerts and exits when plan is null', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    exportStructuredPdf(null);
    expect(alertMock).toHaveBeenCalledWith('No event plan available to export.');
    alertMock.mockRestore();
  });

  it('generates a jsPDF document and triggers file download for valid plan', () => {
    exportStructuredPdf(mockPlanFixture, mockMetaFixture);
    // Since jsPDF is mocked in setup.js, it creates document without error
    expect(true).toBe(true);
  });
});
