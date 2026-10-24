import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../src/App.jsx';
import { EventProvider } from '../../src/context/EventContext.jsx';
import * as apiService from '../../src/services/apiService.js';
import { mockPlanFixture, mockMetaFixture } from '../fixtures/mockPlan.js';
import { SAMPLE_PRESETS } from '../../src/utils/sampleData.js';

describe('EventCraft AI - Full E2E User Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();

    vi.spyOn(apiService, 'fetchServerStatusApi').mockResolvedValue({
      status: 'online',
      appName: 'EventCraft AI',
      model: 'gemini-2.5-flash',
      apiKeyConfigured: true
    });

    vi.spyOn(apiService, 'generateEventPlanApi').mockResolvedValue({
      success: true,
      plan: mockPlanFixture,
      meta: mockMetaFixture
    });

    vi.spyOn(apiService, 'regenerateSectionApi').mockResolvedValue(mockPlanFixture.budget);

    vi.spyOn(apiService, 'chatWithPlannerApi').mockResolvedValue({
      success: true,
      replyMessage: 'I have updated your celebration plan!',
      updatedPlan: {
        ...mockPlanFixture,
        overview: {
          ...mockPlanFixture.overview,
          suggestedTheme: 'Royal Rajputana Heritage Vivah (Adjusted)'
        }
      }
    });
  });

  it('completes the full user journey: intake -> generate -> review -> track -> export -> chat', async () => {
    render(
      <EventProvider>
        <App />
      </EventProvider>
    );

    // 1. Initial State: Navbar and Intake Form are displayed
    expect(screen.getByText('EventCraft')).toBeInTheDocument();
    expect(screen.getByText('Instant Demo Presets')).toBeInTheDocument();

    // 2. Select a Preset
    const firstPreset = SAMPLE_PRESETS[0];
    const presetBtn = screen.getByText(firstPreset.badge);
    fireEvent.click(presetBtn);

    expect(screen.getByDisplayValue('Jaipur')).toBeInTheDocument();

    // 3. Submit and Generate Plan
    const generateBtn = screen.getByText('Generate Master Event Plan');
    fireEvent.click(generateBtn);

    // 4. Verify Plan Renders with 7 Tabs
    await waitFor(() => {
      expect(screen.getByText('Executive Overview & Aesthetic Vision')).toBeInTheDocument();
    });

    expect(screen.getByText('Planning Progress Tracker')).toBeInTheDocument();
    expect(screen.getByText('Strict 100%')).toBeInTheDocument();

    // 5. Navigate to Budget Tab
    fireEvent.click(screen.getByText('Budget'));
    expect(screen.getByText('Category-Wise Budget Breakdown')).toBeInTheDocument();
    expect(screen.getAllByText('Venue & Infrastructure').length).toBeGreaterThan(0);

    // 6. Navigate to Timeline and Toggle a Task Checkbox
    fireEvent.click(screen.getByText('Timeline'));
    expect(screen.getByText('Adaptive Countdown Timeline')).toBeInTheDocument();
    const taskCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(taskCheckbox);

    // Verify Progress Tracker updated
    await waitFor(() => {
      expect(screen.getByText(/1 of 5 timeline milestones/)).toBeInTheDocument();
    });

    // 7. Open Export Modal
    const exportBtn = screen.getByText('Export & Share');
    fireEvent.click(exportBtn);

    expect(screen.getByText('Export & Share Celebration Dossier')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp Summary')).toBeInTheDocument();

    // Switch to PDF tab
    fireEvent.click(screen.getByText('Full Plan PDF'));
    expect(screen.getByText('Download Master PDF')).toBeInTheDocument();

    // Close Modal
    fireEvent.click(screen.getByLabelText('Close'));

    // 8. Open "Ask the Planner" Chat and send adjustment
    const askPlannerBtn = screen.getByText('Ask the Planner');
    fireEvent.click(askPlannerBtn);

    expect(screen.getAllByText('Ask the Planner').length).toBeGreaterThan(0);
    const chatInput = screen.getByPlaceholderText(/Reduce budget by 20%/i);
    fireEvent.change(chatInput, { target: { value: 'Make decor more royal' } });

    const sendBtn = screen.getByLabelText('Send message');
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText('I have updated your celebration plan!')).toBeInTheDocument();
    });

    // Close chat
    fireEvent.click(screen.getByLabelText('Close Chat'));
  }, 20000);
});
