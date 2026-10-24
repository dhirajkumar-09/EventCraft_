import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OverviewTab from '../../../src/components/sections/OverviewTab.jsx';
import BudgetTab from '../../../src/components/sections/BudgetTab.jsx';
import TimelineTab from '../../../src/components/sections/TimelineTab.jsx';
import VendorChecklistTab from '../../../src/components/sections/VendorChecklistTab.jsx';
import PersonalizedIdeasTab from '../../../src/components/sections/PersonalizedIdeasTab.jsx';
import RunSheetTab from '../../../src/components/sections/RunSheetTab.jsx';
import BackupPlanTab from '../../../src/components/sections/BackupPlanTab.jsx';
import { EventContext } from '../../../src/context/useEvent.js';
import { mockPlanFixture, mockMetaFixture } from '../../fixtures/mockPlan.js';

describe('Section Tabs Components', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue()
      }
    });
  });

  const defaultContext = {
    plan: mockPlanFixture,
    meta: mockMetaFixture,
    regenerateSingleSection: vi.fn(),
    regeneratingSection: null,
    checkedItems: {},
    toggleCheckItem: vi.fn()
  };

  const renderWithContext = (Component, ctxOverrides = {}) => {
    return render(
      <EventContext.Provider value={{ ...defaultContext, ...ctxOverrides }}>
        <Component />
      </EventContext.Provider>
    );
  };

  it('renders OverviewTab with theme, key highlights, and handles swatch copy and regenerate', () => {
    const regenMock = vi.fn();
    renderWithContext(OverviewTab, { regenerateSingleSection: regenMock });

    expect(screen.getByText('Executive Overview & Aesthetic Vision')).toBeInTheDocument();
    expect(screen.getByText(mockPlanFixture.overview.suggestedTheme)).toBeInTheDocument();
    expect(screen.getByText('Curated multi-course veg culinary experience')).toBeInTheDocument();

    // Test swatch click to copy hex
    const swatchHex = mockPlanFixture.overview.colorPalette[0].hex;
    const swatchBtn = screen.getByText(swatchHex);
    fireEvent.click(swatchBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(swatchHex);

    // Test regenerate overview button
    const regenBtn = screen.getByText('Regenerate Overview');
    fireEvent.click(regenBtn);
    expect(regenMock).toHaveBeenCalledWith('overview');
  });

  it('renders BudgetTab with DonutChart, breakdown table, and money saving tips', () => {
    renderWithContext(BudgetTab);
    expect(screen.getByText('Category-Wise Budget Breakdown')).toBeInTheDocument();
    expect(screen.getAllByText('Venue & Infrastructure').length).toBeGreaterThan(0);
    expect(screen.getByText('Book weekday slots to save 15%')).toBeInTheDocument();
  });

  it('renders TimelineTab and handles task checkbox toggles & regenerate', () => {
    const toggleMock = vi.fn();
    const regenMock = vi.fn();
    renderWithContext(TimelineTab, { toggleCheckItem: toggleMock, regenerateSingleSection: regenMock });

    expect(screen.getByText('Adaptive Countdown Timeline')).toBeInTheDocument();
    expect(screen.getByText('Foundation & Vision')).toBeInTheDocument();
    expect(screen.getByText('Confirm Venue Booking')).toBeInTheDocument();

    const taskCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(taskCheckbox);
    expect(toggleMock).toHaveBeenCalled();

    const regenBtn = screen.getByText('Regenerate Timeline');
    fireEvent.click(regenBtn);
    expect(regenMock).toHaveBeenCalledWith('timeline');
  });

  it('renders VendorChecklistTab and handles vendor booking checks & regenerate', () => {
    const toggleMock = vi.fn();
    const regenMock = vi.fn();
    renderWithContext(VendorChecklistTab, { toggleCheckItem: toggleMock, regenerateSingleSection: regenMock });

    expect(screen.getByText('Vendor Checklist & Negotiation Playbook')).toBeInTheDocument();
    expect(screen.getByText('Palace Venue')).toBeInTheDocument();
    expect(screen.getByText('Royal Caterer')).toBeInTheDocument();

    const vendorCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(vendorCheckbox);
    expect(toggleMock).toHaveBeenCalled();

    const regenBtn = screen.getByText('Regenerate Vendors');
    fireEvent.click(regenBtn);
    expect(regenMock).toHaveBeenCalledWith('vendorChecklist');
  });

  it('renders PersonalizedIdeasTab with wow moments, decor, menu courses & regenerate', () => {
    const regenMock = vi.fn();
    renderWithContext(PersonalizedIdeasTab, { regenerateSingleSection: regenMock });

    expect(screen.getByText('Personalized Experiences & 3 Wow Moments')).toBeInTheDocument();
    expect(screen.getByText('Cold-Pyro Entry Portal')).toBeInTheDocument();
    expect(screen.getByText('Welcome Beverages')).toBeInTheDocument();

    const regenBtn = screen.getByText('Regenerate Ideas');
    fireEvent.click(regenBtn);
    expect(regenMock).toHaveBeenCalledWith('personalizedIdeas');
  });

  it('renders RunSheetTab with scheduled milestone times & regenerate', () => {
    const regenMock = vi.fn();
    renderWithContext(RunSheetTab, { regenerateSingleSection: regenMock });

    expect(screen.getByText('Event-Day Master Run Sheet')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Vendor Setup')).toBeInTheDocument();

    const regenBtn = screen.getByText('Regenerate Run Sheet');
    fireEvent.click(regenBtn);
    expect(regenMock).toHaveBeenCalledWith('runSheet');
  });

  it('renders BackupPlanTab with contingency risk mitigations & regenerate', () => {
    const regenMock = vi.fn();
    renderWithContext(BackupPlanTab, { regenerateSingleSection: regenMock });

    expect(screen.getByText('Contingency & Emergency Risk Protocols')).toBeInTheDocument();
    expect(screen.getByText('Unseasonal Rain / Weather Disruptions')).toBeInTheDocument();
    expect(screen.getByText(/Activate pre-reserved waterproof canopy/)).toBeInTheDocument();

    const regenBtn = screen.getByText('Regenerate Backup Plan');
    fireEvent.click(regenBtn);
    expect(regenMock).toHaveBeenCalledWith('backupPlan');
  });

  it('triggers regenerateSingleSection when clicking regenerate button on budget tab', () => {
    const regenMock = vi.fn();
    renderWithContext(BudgetTab, { regenerateSingleSection: regenMock });

    const regenBtn = screen.getByText('Regenerate Budget');
    fireEvent.click(regenBtn);
    expect(regenMock).toHaveBeenCalledWith('budget');
  });

  it('renders empty fallback states when plan is null', () => {
    const { container } = renderWithContext(OverviewTab, { plan: null });
    expect(container.firstChild).toBeNull();
  });
});
