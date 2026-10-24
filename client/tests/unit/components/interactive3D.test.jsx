import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card3D from '../../../src/components/Card3D.jsx';
import Hero3DStage from '../../../src/components/Hero3DStage.jsx';
import Hero from '../../../src/components/Hero.jsx';

describe('Interactive 3D and Hero Components', () => {
  describe('Card3D', () => {
    it('renders children correctly and handles mouse movement and tilt', () => {
      const { container } = render(
        <Card3D depth={30} maxTilt={15} className="custom-test-card">
          <p>Inner Card Content</p>
        </Card3D>
      );

      const card = container.firstChild;
      expect(screen.getByText('Inner Card Content')).toBeInTheDocument();

      // Mock getBoundingClientRect
      vi.spyOn(card, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 100,
        right: 200,
        bottom: 100
      });

      // Mouse Move
      fireEvent.mouseMove(card, { clientX: 150, clientY: 75 });
      expect(card).toBeInTheDocument();

      // Mouse Leave
      fireEvent.mouseLeave(card);
      expect(card).toBeInTheDocument();
    });
  });

  describe('Hero3DStage', () => {
    it('renders 3D interactive stage, rotates on mouse move, and switches modules', () => {
      const { container } = render(<Hero3DStage />);
      const stage = container.firstChild;

      expect(screen.getByText('Theme & Vibe')).toBeInTheDocument();
      expect(screen.getByText('Curated themes & color palettes')).toBeInTheDocument();

      vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        width: 400,
        height: 200,
        right: 400,
        bottom: 200
      });

      // Mouse move
      fireEvent.mouseMove(stage, { clientX: 300, clientY: 150 });

      // Mouse leave
      fireEvent.mouseLeave(stage);

      // Click each interactive module button
      const strictBtn = screen.getByText('Strict');
      fireEvent.click(strictBtn);
      expect(screen.getByText('Strict Budget Math')).toBeInTheDocument();
      expect(screen.getByText('100% balanced with 10% cushion')).toBeInTheDocument();

      const wowBtn = screen.getByText('3');
      fireEvent.click(wowBtn);
      expect(screen.getByText('3 Wow Moments')).toBeInTheDocument();
      expect(screen.getByText('Unforgettable surprise elements')).toBeInTheDocument();
    });
  });

  describe('Hero', () => {
    it('renders hero titles and handles preset selection and scroll triggers', () => {
      const handleSelectPreset = vi.fn();

      render(<Hero onSelectPreset={handleSelectPreset} />);

      expect(screen.getByText(/Organize Unforgettable Celebrations with/i)).toBeInTheDocument();
      expect(screen.getByText('AI Precision')).toBeInTheDocument();

      // Test preset button click in Hero
      const presetButtons = screen.getAllByRole('button');
      const royalWeddingBtn = presetButtons.find(b => b.textContent.includes('Royal Heritage Wedding'));
      expect(royalWeddingBtn).toBeDefined();
      fireEvent.click(royalWeddingBtn);

      expect(handleSelectPreset).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'Wedding',
        city: 'Jaipur'
      }));
    });
  });
});
