import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Clean up DOM after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Mock window.scrollTo and HTMLElement.prototype.scrollIntoView for jsdom
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn()
});

if (typeof window !== 'undefined' && window.HTMLElement) {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}));

// Mock jspdf constructor
vi.mock('jspdf', () => {
  return {
    jsPDF: vi.fn().mockImplementation(function () {
      this.save = vi.fn();
      this.text = vi.fn();
      this.setFontSize = vi.fn();
      this.setTextColor = vi.fn();
      this.setFont = vi.fn();
      this.setFillColor = vi.fn();
      this.rect = vi.fn();
      this.roundedRect = vi.fn();
      this.line = vi.fn();
      this.setDrawColor = vi.fn();
      this.splitTextToSize = vi.fn((text) => [text]);
      this.getTextWidth = vi.fn().mockReturnValue(20);
      this.getNumberOfPages = vi.fn().mockReturnValue(2);
      this.setPage = vi.fn();
      this.lastAutoTable = { finalY: 100 };
      this.internal = {
        getNumberOfPages: vi.fn().mockReturnValue(2),
        pageSize: {
          getWidth: () => 210,
          getHeight: () => 297
        }
      };
    })
  };
});

// Mock jspdf-autotable
vi.mock('jspdf-autotable', () => ({
  default: vi.fn((doc) => {
    if (doc) doc.lastAutoTable = { finalY: 120 };
  })
}));
