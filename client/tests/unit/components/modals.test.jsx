import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ApiKeyModal from '../../../src/components/ApiKeyModal.jsx';
import ExportModal from '../../../src/components/ExportModal.jsx';
import ChatPlannerModal from '../../../src/components/ChatPlannerModal.jsx';
import { EventContext } from '../../../src/context/useEvent.js';
import { mockPlanFixture, mockMetaFixture } from '../../fixtures/mockPlan.js';

describe('Modal Components', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue()
      }
    });
  });

  describe('ApiKeyModal', () => {
    it('does not render when isOpen is false', () => {
      const { container } = render(
        <EventContext.Provider value={{ customApiKey: '', saveCustomApiKey: vi.fn(), serverStatus: null }}>
          <ApiKeyModal isOpen={false} onClose={vi.fn()} />
        </EventContext.Provider>
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders modal, saves key, clears key, and closes on backdrop click', () => {
      const saveMock = vi.fn();
      const closeMock = vi.fn();

      render(
        <EventContext.Provider
          value={{
            customApiKey: 'AIzaExistingKey',
            saveCustomApiKey: saveMock,
            serverStatus: { apiKeyConfigured: true }
          }}
        >
          <ApiKeyModal isOpen={true} onClose={closeMock} />
        </EventContext.Provider>
      );

      expect(screen.getByText('Google Gemini API Setup')).toBeInTheDocument();
      expect(screen.getByDisplayValue('AIzaExistingKey')).toBeInTheDocument();

      // Clear key
      const clearBtn = screen.getByText('Clear Key');
      fireEvent.click(clearBtn);
      expect(saveMock).toHaveBeenCalledWith('');

      // Input new key
      const input = screen.getByPlaceholderText('AIzaSy...');
      fireEvent.change(input, { target: { value: 'AIzaSyNewKey123' } });

      // Save key
      fireEvent.click(screen.getByText('Save Key'));
      expect(saveMock).toHaveBeenCalledWith('AIzaSyNewKey123');

      // Click outer overlay backdrop to close
      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog);
      expect(closeMock).toHaveBeenCalled();
    });
  });

  describe('ExportModal', () => {
    it('does not render when isOpen is false or plan is null', () => {
      const { container } = render(
        <EventContext.Provider value={{ plan: null, meta: null }}>
          <ExportModal isOpen={false} onClose={vi.fn()} />
        </EventContext.Provider>
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders tabs, switches to checklist & PDF, triggers copy, and closes on backdrop', () => {
      const closeMock = vi.fn();
      render(
        <EventContext.Provider value={{ plan: mockPlanFixture, meta: mockMetaFixture }}>
          <ExportModal isOpen={true} onClose={closeMock} />
        </EventContext.Provider>
      );

      expect(screen.getByText('Export & Share Celebration Dossier')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp Summary')).toBeInTheDocument();
      expect(screen.getByText('Full Plan PDF')).toBeInTheDocument();

      // Switch to Checklist tab
      fireEvent.click(screen.getByText('Printable Checklist'));
      expect(screen.getByText('Printable Physical Vendor & Task Checklist')).toBeInTheDocument();

      // Switch to PDF tab
      fireEvent.click(screen.getByText('Full Plan PDF'));
      expect(screen.getByText('Download Master PDF')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Download Master PDF'));

      // Switch back to WhatsApp tab and trigger copy
      fireEvent.click(screen.getByText('WhatsApp Summary'));
      const copyBtn = screen.getByText('Copy Text');
      fireEvent.click(copyBtn);
      expect(navigator.clipboard.writeText).toHaveBeenCalled();

      // Click dialog backdrop
      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog);
      expect(closeMock).toHaveBeenCalled();
    });
  });

  describe('ChatPlannerModal', () => {
    it('does not render when isChatOpen is false', () => {
      const { container } = render(
        <EventContext.Provider
          value={{
            isChatOpen: false,
            setIsChatOpen: vi.fn(),
            chatHistory: [],
            sendChatMessage: vi.fn()
          }}
        >
          <ChatPlannerModal />
        </EventContext.Provider>
      );
      expect(container.firstChild).toBeNull();
    });

    it('submits on Enter key, ignores Shift+Enter, uses suggested prompts, and closes on backdrop', async () => {
      const sendMock = vi.fn().mockResolvedValue();
      const setIsChatOpenMock = vi.fn();

      render(
        <EventContext.Provider
          value={{
            isChatOpen: true,
            setIsChatOpen: setIsChatOpenMock,
            chatHistory: [
              { id: '1', role: 'assistant', text: 'Namaste! How can I assist?' }
            ],
            sendChatMessage: sendMock
          }}
        >
          <ChatPlannerModal />
        </EventContext.Provider>
      );

      const input = screen.getByPlaceholderText(/Reduce budget by 20%/i);

      // Shift+Enter should not submit
      fireEvent.change(input, { target: { value: 'Multiline instruction' } });
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
      expect(sendMock).not.toHaveBeenCalled();

      // Regular Enter submits
      await act(async () => {
        fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });
      });
      expect(sendMock).toHaveBeenCalledWith('Multiline instruction');

      // Click suggested prompt button
      const promptBtn = screen.getByText('Reduce budget by 20%');
      await act(async () => {
        fireEvent.click(promptBtn);
      });
      expect(sendMock).toHaveBeenCalledWith('Reduce budget by 20%');

      // Click backdrop to close
      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog);
      expect(setIsChatOpenMock).toHaveBeenCalledWith(false);
    });
  });
});
