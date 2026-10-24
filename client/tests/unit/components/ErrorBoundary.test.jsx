import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../../src/components/common/ErrorBoundary.jsx';

function BuggyComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Test exploded in rendering');
  }
  return <div>Component rendered safely</div>;
}

describe('ErrorBoundary Component', () => {
  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Component rendered safely')).toBeInTheDocument();
  });

  it('catches render error and displays user-friendly recovery UI', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went unexpectedly wrong')).toBeInTheDocument();
    expect(
      screen.getByText(/We encountered an issue rendering this celebration view/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('resets error state when clicking Try Again button', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went unexpectedly wrong')).toBeInTheDocument();

    // Re-render with safe component
    rerender(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Try Again'));
    expect(screen.getByText('Component rendered safely')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
