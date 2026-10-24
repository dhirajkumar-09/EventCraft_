import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DonutChart from '../../../src/components/DonutChart.jsx';
import DonutCenterBadge from '../../../src/components/charts/DonutCenterBadge.jsx';
import DonutLegend from '../../../src/components/charts/DonutLegend.jsx';
import { mockPlanFixture } from '../../fixtures/mockPlan.js';

describe('Chart Components', () => {
  const categories = mockPlanFixture.budget.categories;

  describe('DonutCenterBadge', () => {
    it('renders total budget when no category is hovered', () => {
      render(
        <DonutCenterBadge
          activeCategory={null}
          currencySymbol="₹"
          totalBudget={1500000}
        />
      );

      expect(screen.getByText('Total Budget')).toBeInTheDocument();
      expect(screen.getByText('100% Balanced')).toBeInTheDocument();
    });

    it('renders focused category details when category is hovered', () => {
      render(
        <DonutCenterBadge
          activeCategory={{ name: 'Venue & Infrastructure', amount: 360000, percentage: 24 }}
          currencySymbol="₹"
          totalBudget={1500000}
        />
      );

      expect(screen.getByText('Venue & Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('24%')).toBeInTheDocument();
    });
  });

  describe('DonutLegend', () => {
    it('renders all category items with amounts and triggers onHover and onLeave', () => {
      const onHover = vi.fn();
      const onLeave = vi.fn();
      render(
        <DonutLegend
          segments={categories}
          hoveredIndex={null}
          currencySymbol="₹"
          onHover={onHover}
          onLeave={onLeave}
        />
      );

      expect(screen.getByText('Venue & Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('24%')).toBeInTheDocument();

      const item = screen.getByText('Venue & Infrastructure').closest('div[class*="flex items-center justify-between"]');
      fireEvent.mouseEnter(item);
      expect(onHover).toHaveBeenCalledWith(0);

      fireEvent.mouseLeave(item);
      expect(onLeave).toHaveBeenCalled();
    });
  });

  describe('DonutChart', () => {
    it('renders SVG donut chart segments, total, and handles segment hover', () => {
      const { container } = render(
        <DonutChart
          categories={categories}
          totalBudget={1500000}
          currencySymbol="₹"
        />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(screen.getByText('Total Budget')).toBeInTheDocument();
      expect(screen.getByText('Venue & Infrastructure')).toBeInTheDocument();

      // Test segment circle hover
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBeGreaterThan(0);
      const segmentCircle = circles[0];
      fireEvent.mouseEnter(segmentCircle);
      fireEvent.mouseLeave(segmentCircle);
    });

    it('handles empty categories list safely', () => {
      const { container } = render(
        <DonutChart
          categories={[]}
          totalBudget={0}
          currencySymbol="₹"
        />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
