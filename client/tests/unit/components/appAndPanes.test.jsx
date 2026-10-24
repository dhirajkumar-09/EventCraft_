import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TabContentRenderer from '../../../src/components/TabContentRenderer.jsx';
import PdfExportPane from '../../../src/components/export/PdfExportPane.jsx';
import WhatsAppExportPane from '../../../src/components/export/WhatsAppExportPane.jsx';
import ProgressTracker from '../../../src/components/ProgressTracker.jsx';
import App from '../../../src/App.jsx';
import { EventContext } from '../../../src/context/useEvent.js';
import { mockPlanFixture, mockMetaFixture } from '../../fixtures/mockPlan.js';
import * as exportPdfModule from '../../../src/utils/exportPdf.js';
import * as whatsappFormatModule from '../../../src/utils/whatsappFormat.js';

describe('App & Panes Components Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('TabContentRenderer', () => {
    const tabs = [
      'overview',
      'budget',
      'timeline',
      'vendorChecklist',
      'personalizedIdeas',
      'runSheet',
      'backupPlan',
      'unknownTab'
    ];

    tabs.forEach((tab) => {
      it(`renders tab content for "${tab}" correctly`, () => {
        const mockContext = {
          plan: mockPlanFixture,
          meta: mockMetaFixture,
          activeTab: tab,
          checkedItems: {},
          toggleCheckItem: vi.fn(),
          regeneratingSection: null,
          regenerateSingleSection: vi.fn(),
          totalItemsCount: 10,
          checkedItemsCount: 0,
          progressPercentage: 0
        };

        const { container } = render(
          <EventContext.Provider value={mockContext}>
            <TabContentRenderer activeTab={tab} />
          </EventContext.Provider>
        );

        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });

  describe('PdfExportPane', () => {
    it('handles full master PDF download trigger', () => {
      const exportPdfSpy = vi.spyOn(exportPdfModule, 'exportStructuredPdf').mockImplementation(() => {});

      render(
        <PdfExportPane
          plan={mockPlanFixture}
          meta={mockMetaFixture}
          activeExportMode="pdf"
        />
      );

      expect(screen.getByText('Download Complete Master Event Plan (PDF)')).toBeInTheDocument();
      const downloadBtn = screen.getByText('Download Master PDF');
      fireEvent.click(downloadBtn);

      expect(exportPdfSpy).toHaveBeenCalledWith(mockPlanFixture, mockMetaFixture);
    });

    it('handles physical print checklist trigger', () => {
      const printSpy = vi.spyOn(exportPdfModule, 'triggerPrintPlan').mockImplementation(() => {});

      render(
        <PdfExportPane
          plan={mockPlanFixture}
          meta={mockMetaFixture}
          activeExportMode="checklist"
        />
      );

      expect(screen.getByText('Printable Physical Vendor & Task Checklist')).toBeInTheDocument();
      const printBtn = screen.getByText('Open Print Dialog');
      fireEvent.click(printBtn);

      expect(printSpy).toHaveBeenCalled();
    });
  });

  describe('WhatsAppExportPane', () => {
    it('renders formatted text and triggers copy and share', () => {
      const onCopy = vi.fn();
      const openSpy = vi.spyOn(whatsappFormatModule, 'openWhatsAppShare').mockImplementation(() => {});

      const { rerender } = render(
        <WhatsAppExportPane
          whatsappText="🎉 *Wedding Plan*"
          onCopy={onCopy}
          copied={false}
        />
      );

      expect(screen.getByDisplayValue('🎉 *Wedding Plan*')).toBeInTheDocument();

      // Click copy button
      const copyBtn = screen.getByText('Copy Text');
      fireEvent.click(copyBtn);
      expect(onCopy).toHaveBeenCalled();

      // Click open in WhatsApp
      const openBtn = screen.getByText('Open in WhatsApp');
      fireEvent.click(openBtn);
      expect(openSpy).toHaveBeenCalledWith('🎉 *Wedding Plan*');

      // Rerender with copied=true
      rerender(
        <WhatsAppExportPane
          whatsappText="🎉 *Wedding Plan*"
          onCopy={onCopy}
          copied={true}
        />
      );
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  describe('ProgressTracker', () => {
    it('returns null if totalItemsCount is 0', () => {
      const mockContext = {
        progressPercentage: 0,
        checkedItemsCount: 0,
        totalItemsCount: 0,
        resetProgress: vi.fn(),
        setIsChatOpen: vi.fn(),
        triggerCelebration: vi.fn()
      };

      const { container } = render(
        <EventContext.Provider value={mockContext}>
          <ProgressTracker />
        </EventContext.Provider>
      );

      expect(container.firstChild).toBeNull();
    });

    it('renders progress bar, milestone stats, and triggers reset & chat', () => {
      const resetProgress = vi.fn();
      const setIsChatOpen = vi.fn();
      const triggerCelebration = vi.fn();

      const mockContext = {
        progressPercentage: 50,
        checkedItemsCount: 5,
        totalItemsCount: 10,
        resetProgress,
        setIsChatOpen,
        triggerCelebration
      };

      render(
        <EventContext.Provider value={mockContext}>
          <ProgressTracker />
        </EventContext.Provider>
      );

      expect(screen.getByText('Planning Progress Tracker')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText(/5 of 10 timeline milestones/)).toBeInTheDocument();

      // Reset progress button
      const resetBtn = screen.getByTitle('Reset all checked items');
      fireEvent.click(resetBtn);
      expect(resetProgress).toHaveBeenCalled();

      // Ask planner adjustment button
      const adjustBtn = screen.getByText(/Ask Planner for Edits/i);
      fireEvent.click(adjustBtn);
      expect(setIsChatOpen).toHaveBeenCalledWith(true);
    });

    it('triggers celebration confetti when reaching 100% progress', () => {
      const triggerCelebration = vi.fn();

      const mockContext = {
        progressPercentage: 100,
        checkedItemsCount: 10,
        totalItemsCount: 10,
        resetProgress: vi.fn(),
        setIsChatOpen: vi.fn(),
        triggerCelebration
      };

      render(
        <EventContext.Provider value={mockContext}>
          <ProgressTracker />
        </EventContext.Provider>
      );

      expect(triggerCelebration).toHaveBeenCalled();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('App error banner and modals', () => {
    it('renders error banner and allows dismissal', () => {
      const setError = vi.fn();
      const mockContext = {
        themeMode: 'light',
        toggleTheme: vi.fn(),
        plan: null,
        meta: null,
        setPlan: vi.fn(),
        checkedItems: {},
        toggleCheckItem: vi.fn(),
        resetProgress: vi.fn(),
        totalItemsCount: 0,
        checkedItemsCount: 0,
        progressPercentage: 0,
        activeTab: 'overview',
        setActiveTab: vi.fn(),
        isLoading: false,
        currentLoadingQuote: 'Crafting...',
        regeneratingSection: null,
        error: 'Network connection failed during generation',
        setError,
        isChatOpen: false,
        setIsChatOpen: vi.fn(),
        serverStatus: null,
        generatePlan: vi.fn(),
        regenerateSingleSection: vi.fn(),
        sendChatMessage: vi.fn(),
        triggerCelebration: vi.fn(),
        customApiKey: '',
        saveCustomApiKey: vi.fn(),
        chatHistory: [],
        setChatHistory: vi.fn()
      };

      render(
        <EventContext.Provider value={mockContext}>
          <App />
        </EventContext.Provider>
      );

      expect(screen.getByText('Generation Error')).toBeInTheDocument();
      expect(screen.getByText('Network connection failed during generation')).toBeInTheDocument();

      const dismissBtn = screen.getByText('Dismiss & Retry');
      fireEvent.click(dismissBtn);
      expect(setError).toHaveBeenCalledWith(null);
    });

    it('opens and closes API key modal and Export modal from Navbar buttons', () => {
      const mockContext = {
        themeMode: 'light',
        toggleTheme: vi.fn(),
        plan: mockPlanFixture,
        meta: mockMetaFixture,
        setPlan: vi.fn(),
        checkedItems: {},
        toggleCheckItem: vi.fn(),
        resetProgress: vi.fn(),
        totalItemsCount: 5,
        checkedItemsCount: 0,
        progressPercentage: 0,
        activeTab: 'overview',
        setActiveTab: vi.fn(),
        isLoading: false,
        currentLoadingQuote: 'Crafting...',
        regeneratingSection: null,
        error: null,
        setError: vi.fn(),
        isChatOpen: false,
        setIsChatOpen: vi.fn(),
        serverStatus: { status: 'online', isGeminiConfigured: true },
        generatePlan: vi.fn(),
        regenerateSingleSection: vi.fn(),
        sendChatMessage: vi.fn(),
        triggerCelebration: vi.fn(),
        customApiKey: '',
        saveCustomApiKey: vi.fn(),
        chatHistory: [],
        setChatHistory: vi.fn()
      };

      render(
        <EventContext.Provider value={mockContext}>
          <App />
        </EventContext.Provider>
      );

      // Open API key modal
      const apiKeyBtn = screen.getByTitle('Configure Google Gemini API Key');
      fireEvent.click(apiKeyBtn);
      expect(screen.getByText('Google Gemini API Setup')).toBeInTheDocument();

      // Close API key modal
      const closeApiKeyBtn = screen.getByLabelText('Close');
      fireEvent.click(closeApiKeyBtn);

      // Open Export modal from Navbar
      const exportBtn = screen.getByTitle('Export Master PDF or Share via WhatsApp');
      fireEvent.click(exportBtn);
      expect(screen.getByText('Export & Share Celebration Dossier')).toBeInTheDocument();

      // Close Export modal
      const closeExportBtn = screen.getByLabelText('Close');
      fireEvent.click(closeExportBtn);
    });

    it('handles preset selection and clearing from Hero and EventForm in App', () => {
      const mockContext = {
        themeMode: 'light',
        toggleTheme: vi.fn(),
        plan: null,
        meta: null,
        setPlan: vi.fn(),
        checkedItems: {},
        toggleCheckItem: vi.fn(),
        resetProgress: vi.fn(),
        totalItemsCount: 0,
        checkedItemsCount: 0,
        progressPercentage: 0,
        activeTab: 'overview',
        setActiveTab: vi.fn(),
        isLoading: false,
        currentLoadingQuote: 'Crafting...',
        regeneratingSection: null,
        error: null,
        setError: vi.fn(),
        isChatOpen: false,
        setIsChatOpen: vi.fn(),
        serverStatus: null,
        generatePlan: vi.fn(),
        regenerateSingleSection: vi.fn(),
        sendChatMessage: vi.fn(),
        triggerCelebration: vi.fn(),
        customApiKey: '',
        saveCustomApiKey: vi.fn(),
        chatHistory: [],
        setChatHistory: vi.fn()
      };

      render(
        <EventContext.Provider value={mockContext}>
          <App />
        </EventContext.Provider>
      );

      const presetBtn = screen.getAllByRole('button').find(b => b.textContent.includes('Royal Heritage Wedding'));
      if (presetBtn) {
        fireEvent.click(presetBtn);
      }

      const clearBtn = screen.getByTitle('Clear all fields');
      fireEvent.click(clearBtn);
    });
  });
});
