import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NotificationsPanel } from './NotificationsPanel';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('NotificationsPanel', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('does not render when isOpen is false', () => {
    render(<NotificationsPanel isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText(/Notifications/)).not.toBeInTheDocument();
  });

  it('renders correctly when isOpen is true', () => {
    render(<NotificationsPanel isOpen={true} onClose={mockOnClose} />);

    // Check header
    expect(screen.getByText('Notifications')).toBeInTheDocument();

    // Check initial count
    expect(screen.getByText(/4 items need your attention/)).toBeInTheDocument();

    // Check that notifications are rendered
    expect(screen.getByText(/Salesforce integration requires/)).toBeInTheDocument();
    expect(screen.getByText(/CustomerSync_v2/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<NotificationsPanel isOpen={true} onClose={mockOnClose} />);

    // Using closest 'button' containing the close icon.
    // The X icon component might not be directly queryable, but we can find the button.
    const buttons = screen.getAllByRole('button');
    // First button should be the close button in the header
    fireEvent.click(buttons[0]);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('resolves notification when action button is clicked', () => {
    render(<NotificationsPanel isOpen={true} onClose={mockOnClose} />);

    // Initial state check
    expect(screen.getByText(/4 items need your attention/)).toBeInTheDocument();

    // Find the action button for the first notification
    const actionButton = screen.getByText('Grant Permission');
    expect(actionButton).toBeInTheDocument();

    // Click action button
    fireEvent.click(actionButton);

    // Check that the action button is no longer visible for that resolved notification
    expect(screen.queryByText('Grant Permission')).not.toBeInTheDocument();

    // Check the count is updated to 3
    expect(screen.getByText(/3 items need your attention/)).toBeInTheDocument();
  });
});
