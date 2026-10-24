import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../../src/components/Navbar.jsx';
import ProgressTracker from '../../../src/components/ProgressTracker.jsx';
import LoadingSkeleton from '../../../src/components/LoadingSkeleton.jsx';
import TabsNav from '../../../src/components/TabsNav.jsx';
import TabContentRenderer from '../../../src/components/TabContentRenderer.jsx';
import { EventContext } from '../../../src/context/useEvent.js';
import { mockPlanFixture, mockMetaFixture } from '../../fixtures/mockPlan.js';

describe('Common Components', () => {
  describe('Navbar', () => {
    it('renders logo, brand title, and action buttons', () => {
      const onOpenApiKey = vi.fn();
      const onOpenExport = vi.fn();
      const onOpenChat = vi.fn();

      render(
        <EventContext.Provider
          value={{
            themeMode: 'light',
            toggleTheme: vi.fn(),
            plan: mockPlanFixture,
            meta: mockMetaFixture,
            isChatOpen: false,
            serverStatus: { apiKeyConfigured: true }
          }}
        >
          <Navbar
            onOpenApiKey={onOpenApiKey}
            onOpenExport={onOpenExport}
            onOpenChat={onOpenChat}
          />
        </EventContext.Provider>
      );

      expect(screen.getByText('EventCraft')).toBeInTheDocument();
      expect(screen.getByText('Export & Share')).toBeInTheDocument();
      expect(screen.getByText('Gemini AI Active')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Export & Share'));
      expect(onOpenExport).toHaveBeenCalled();
    });
  });

  describe('ProgressTracker', () => {
    it('does not render when totalItemsCount is 0', () => {
      const { container } = render(
        <EventContext.Provider
          value={{
            totalItemsCount: 0,
            checkedItemsCount: 0,
            progressPercentage: 0,
            resetProgress: vi.fn(),
            setIsChatOpen: vi.fn(),
            triggerCelebration: vi.fn()
          }}
        >
          <ProgressTracker />
        </EventContext.Provider>
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders progress bar and handles reset progress button', () => {
      const mockReset = vi.fn();
      render(
        <EventContext.Provider
          value={{
            totalItemsCount: 10,
            checkedItemsCount: 6,
            progressPercentage: 60,
            resetProgress: mockReset,
            setIsChatOpen: vi.fn(),
            triggerCelebration: vi.fn()
          }}
        >
          <ProgressTracker />
        </EventContext.Provider>
      );

      expect(screen.getByText('Planning Progress Tracker')).toBeInTheDocument();
      expect(screen.getByText(/6 of 10 timeline milestones/)).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Reset'));
      expect(mockReset).toHaveBeenCalled();
    });
  });

  describe('LoadingSkeleton', () => {
    it('renders generating animation and current loading quote', () => {
      render(
        <EventContext.Provider
          value={{
            currentLoadingQuote: 'Balancing multi-tier vendor quotes with zero mathematical error...'
          }}
        >
          <LoadingSkeleton />
        </EventContext.Provider>
      );

      expect(screen.getByText('EventCraft AI is Designing Your Celebration')).toBeInTheDocument();
      expect(
        screen.getByText(/Balancing multi-tier vendor quotes/)
      ).toBeInTheDocument();
    });
  });

  describe('TabsNav', () => {
    it('renders all 7 navigation tabs and invokes setActiveTab on tab click', () => {
      const mockSetActiveTab = vi.fn();
      render(
        <EventContext.Provider
          value={{
            activeTab: 'overview',
            setActiveTab: mockSetActiveTab
          }}
        >
          <TabsNav />
        </EventContext.Provider>
      );

      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Budget')).toBeInTheDocument();
      expect(screen.getByText('Timeline')).toBeInTheDocument();
      expect(screen.getByText('Vendors')).toBeInTheDocument();
      expect(screen.getByText('Ideas & Wow')).toBeInTheDocument();
      expect(screen.getByText('Run Sheet')).toBeInTheDocument();
      expect(screen.getByText('Backup Plan')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Budget'));
      expect(mockSetActiveTab).toHaveBeenCalledWith('budget');
    });
  });

  describe('TabContentRenderer', () => {
    it('renders the active tab component', () => {
      render(
        <EventContext.Provider
          value={{
            activeTab: 'overview',
            plan: mockPlanFixture,
            meta: mockMetaFixture,
            regenerateSingleSection: vi.fn(),
            regeneratingSection: null
          }}
        >
          <TabContentRenderer activeTab="overview" />
        </EventContext.Provider>
      );

      expect(screen.getByText('Executive Overview & Aesthetic Vision')).toBeInTheDocument();
    });
  });
});
